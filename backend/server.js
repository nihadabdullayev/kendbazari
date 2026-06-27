const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDb, writeDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serving static files from layihə root (frontend files)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configure uploads directory
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Public image upload endpoint
app.post('/api/upload', (req, res) => {
  const { base64Data } = req.body;
  if (!base64Data) {
    return res.status(400).json({ error: 'Yüklənəcək şəkil tapılmadı!' });
  }

  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: 'Format yanlışdır!' });
  }

  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  // Get extension from mimeType
  const ext = mimeType.split('/')[1] || 'png';
  const newFilename = `upload-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
  const savePath = path.join(uploadsDir, newFilename);

  fs.writeFile(savePath, buffer, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Fayl diskə yazıla bilmədi!' });
    }
    res.json({ url: `/uploads/${newFilename}` });
  });
});

// Simple Auth Middleware
const ADMIN_TOKEN = 'kb-admin-super-secret-token-123';
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (authHeader === `Bearer ${ADMIN_TOKEN}` || authHeader === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'İcazə yoxdur!' });
  }
}

// ----------------- PUBLIC ENDPOINTS -----------------

// Get categories
app.get('/api/categories', (req, res) => {
  const db = readDb();
  res.json(db.categories);
});

// Get products
app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json(db.products);
});

// Get producers
app.get('/api/producers', (req, res) => {
  const db = readDb();
  res.json(db.producers);
});

// Get blogs
app.get('/api/blogs', (req, res) => {
  const db = readDb();
  res.json(db.blogs || []);
});

// Get reviews for a specific product
app.get('/api/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const prodReviews = (db.reviews || []).filter(r => r.productId === id);
  res.json(prodReviews);
});

// Add a review to a product
app.post('/api/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { name, rating, text } = req.body;
  
  if (!name || !rating || !text) {
    return res.status(400).json({ error: 'Bütün rəy məlumatları doldurulmalıdır!' });
  }

  const db = readDb();
  const product = db.products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Məhsul tapılmadı!' });
  }

  const newReview = {
    id: 'rev-' + id + '-' + Date.now(),
    productId: id,
    name,
    rating: parseInt(rating),
    text,
    date: new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  if (!db.reviews) db.reviews = [];
  db.reviews.unshift(newReview);

  // Re-calculate product rating & reviewsCount
  const prodReviews = db.reviews.filter(r => r.productId === id);
  product.reviewsCount = prodReviews.length;
  const sumRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
  product.rating = parseFloat((sumRating / prodReviews.length).toFixed(1));

  writeDb(db);
  res.status(201).json(newReview);
});

// Get general settings
app.get('/api/settings', (req, res) => {
  const db = readDb();
  res.json(db.settings || {});
});

// Post an order (from checkout)
app.post('/api/orders', (req, res) => {
  const { customer, items, total } = req.body;
  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ error: 'Sifariş məlumatları əksikdir!' });
  }

  const db = readDb();
  const newOrder = {
    id: 'KB-ORD-' + Math.floor(100000 + Math.random() * 900000),
    customer,
    items,
    total,
    status: 'Gözləmədə',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);
  writeDb(db);

  res.status(201).json({ success: true, orderId: newOrder.id });
});

// Admin Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  const user = db.adminUsers.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ token: ADMIN_TOKEN, username: user.username });
  } else {
    res.status(400).json({ error: 'İstifadəçi adı və ya şifrə yanlışdır!' });
  }
});

// ----------------- ADMIN ENDPOINTS (SECURE) -----------------

// Get all orders
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const db = readDb();
  const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

// Update order status
app.put('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const db = readDb();
  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Sifariş tapılmadı!' });
  }

  order.status = status;
  writeDb(db);
  res.json({ success: true, order });
});

// Add a product (supports all inputs!)
app.post('/api/admin/products', requireAdmin, (req, res) => {
  const productData = req.body;
  if (!productData.title || !productData.price || !productData.category) {
    return res.status(400).json({ error: 'Məhsul adı, qiyməti və kateqoriyası mütləqdir!' });
  }

  const db = readDb();
  
  const newId = 'p' + (db.products.length + 1);
  const slug = productData.title
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Find producer info dynamically from producerId
  const producerObj = db.producers.find(pr => pr.id === productData.producerId) || db.producers[0];

  const newProduct = {
    id: newId,
    slug: slug,
    title: productData.title,
    category: productData.category,
    subcategory: productData.subcategory || '',
    price: parseFloat(productData.price),
    oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : null,
    rating: 5.0,
    reviewsCount: 0,
    image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    images: productData.images || [productData.image],
    description: productData.description || '',
    variantName: productData.variantName || '',
    variantValues: productData.variantValues || [],
    colors: [],
    sizes: productData.variantValues || [],
    features: productData.features || [],
    inStock: productData.inStock !== undefined ? productData.inStock : true,
    featured: productData.featured !== undefined ? productData.featured : false,
    sku: productData.sku || ('KB-' + slug.toUpperCase().substring(0, 5) + '-' + Math.floor(10 + Math.random() * 90)),
    producerId: producerObj.id,
    producer: producerObj.name,
    producerImage: producerObj.image,
    producerBio: producerObj.bio
  };

  db.products.push(newProduct);
  writeDb(db);
  res.status(201).json({ success: true, product: newProduct });
});

// Edit a product (supports all inputs!)
app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  const db = readDb();
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Məhsul tapılmadı!' });
  }

  const producerObj = db.producers.find(pr => pr.id === productData.producerId) || db.producers[0];

  db.products[index] = {
    ...db.products[index],
    title: productData.title || db.products[index].title,
    category: productData.category || db.products[index].category,
    subcategory: productData.subcategory !== undefined ? productData.subcategory : db.products[index].subcategory,
    price: productData.price ? parseFloat(productData.price) : db.products[index].price,
    oldPrice: productData.oldPrice !== undefined ? (productData.oldPrice ? parseFloat(productData.oldPrice) : null) : db.products[index].oldPrice,
    description: productData.description || db.products[index].description,
    image: productData.image || db.products[index].image,
    images: productData.images || db.products[index].images,
    variantName: productData.variantName !== undefined ? productData.variantName : db.products[index].variantName,
    variantValues: productData.variantValues !== undefined ? productData.variantValues : db.products[index].variantValues,
    colors: [],
    sizes: productData.variantValues !== undefined ? productData.variantValues : db.products[index].sizes,
    features: productData.features || db.products[index].features,
    inStock: productData.inStock !== undefined ? productData.inStock : db.products[index].inStock,
    featured: productData.featured !== undefined ? productData.featured : db.products[index].featured,
    sku: productData.sku || db.products[index].sku,
    producerId: producerObj.id,
    producer: producerObj.name,
    producerImage: producerObj.image,
    producerBio: producerObj.bio
  };

  writeDb(db);
  res.json({ success: true, product: db.products[index] });
});

// Delete a product
app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.products = db.products.filter(p => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Edit a category (specifically description texts!)
app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, icon, descriptionTop, descriptionBottom } = req.body;

  const db = readDb();
  const category = db.categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).json({ error: 'Kateqoriya tapılmadı!' });
  }

  category.name = name || category.name;
  category.icon = icon || category.icon;
  category.descriptionTop = descriptionTop !== undefined ? descriptionTop : category.descriptionTop;
  category.descriptionBottom = descriptionBottom !== undefined ? descriptionBottom : category.descriptionBottom;

  writeDb(db);
  res.json({ success: true, category });
});

// Add a producer
app.post('/api/admin/producers', requireAdmin, (req, res) => {
  const db = readDb();
  const newProducer = {
    id: 'pr' + (db.producers.length + 1),
    name: req.body.name,
    location: req.body.location || 'Azərbaycan',
    since: parseInt(req.body.since) || new Date().getFullYear(),
    specialty: req.body.specialty || '',
    image: req.body.image || '/images/producers/mammad_ami.png',
    heroImage: req.body.heroImage || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80',
    bio: req.body.bio || '',
    badges: req.body.badges || []
  };

  db.producers.push(newProducer);
  writeDb(db);
  res.status(201).json(newProducer);
});

// Edit a producer
app.put('/api/admin/producers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.producers.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'İstehsalçı tapılmadı!' });
  }

  db.producers[index] = {
    ...db.producers[index],
    name: req.body.name || db.producers[index].name,
    location: req.body.location || db.producers[index].location,
    since: req.body.since ? parseInt(req.body.since) : db.producers[index].since,
    specialty: req.body.specialty || db.producers[index].specialty,
    image: req.body.image || db.producers[index].image,
    bio: req.body.bio || db.producers[index].bio
  };

  writeDb(db);
  res.json(db.producers[index]);
});

// Delete a producer
app.delete('/api/admin/producers/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.producers = db.producers.filter(p => p.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Add a blog
app.post('/api/admin/blogs', requireAdmin, (req, res) => {
  const db = readDb();
  const title = req.body.title;
  const slug = title
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const newBlog = {
    id: 'blog-' + Date.now(),
    slug: slug,
    title: title,
    content: req.body.content || '',
    image: req.body.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    date: new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  if (!db.blogs) db.blogs = [];
  db.blogs.push(newBlog);
  writeDb(db);
  res.status(201).json(newBlog);
});

// Edit a blog
app.put('/api/admin/blogs/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.blogs.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Blog tapılmadı!' });
  }

  db.blogs[index] = {
    ...db.blogs[index],
    title: req.body.title || db.blogs[index].title,
    content: req.body.content || db.blogs[index].content,
    image: req.body.image || db.blogs[index].image
  };

  writeDb(db);
  res.json(db.blogs[index]);
});

// Delete a blog
app.delete('/api/admin/blogs/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.blogs = db.blogs.filter(b => b.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Get all reviews (for Admin Panel tab)
app.get('/api/admin/reviews', requireAdmin, (req, res) => {
  const db = readDb();
  res.json(db.reviews || []);
});

// Delete a review
app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  
  if (!db.reviews) db.reviews = [];
  const review = db.reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ error: 'Rəy tapılmadı!' });
  }

  db.reviews = db.reviews.filter(r => r.id !== id);

  // Recalculate rating for related product
  const product = db.products.find(p => p.id === review.productId);
  if (product) {
    const prodReviews = db.reviews.filter(r => r.productId === review.productId);
    product.reviewsCount = prodReviews.length;
    if (prodReviews.length > 0) {
      const sumRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = parseFloat((sumRating / prodReviews.length).toFixed(1));
    } else {
      product.rating = 5.0;
    }
  }

  writeDb(db);
  res.json({ success: true });
});

// Update general settings
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const db = readDb();
  db.settings = {
    ...db.settings,
    storeName: req.body.storeName || db.settings.storeName,
    phone: req.body.phone || db.settings.phone,
    email: req.body.email || db.settings.email,
    address: req.body.address || db.settings.address,
    promocodes: req.body.promocodes || db.settings.promocodes
  };

  writeDb(db);
  res.json(db.settings);
});

// Catch-all route to serve index.html or handle clean URL routing correctly in Express!
app.get('/*splat', (req, res) => {
  const cleanPaths = ['/cart', '/checkout', '/success', '/butun-mehsullar'];
  const isCleanPath = cleanPaths.some(p => req.path.startsWith(p));
  
  const categories = ['sud-ve-agarti', 'meyve-terevez', 'bal-ve-murebbeler', 'un-ve-taxil'];
  const isCategoryOrProduct = categories.some(cat => req.path.startsWith(`/${cat}`));

  if (req.path.startsWith('/admin')) {
    res.sendFile(path.join(__dirname, '..', 'public', 'admin.html'));
  } else if (isCleanPath) {
    const filename = req.path.split('/')[1];
    res.sendFile(path.join(__dirname, '..', 'public', `${filename}.html`));
  } else if (isCategoryOrProduct) {
    const parts = req.path.split('/').filter(Boolean);
    if (parts.length === 2) {
      res.sendFile(path.join(__dirname, '..', 'public', 'product.html'));
    } else {
      res.sendFile(path.join(__dirname, '..', 'public', 'category.html'));
    }
  } else {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
