const fs = require('fs');
const path = require('path');

const dbJsPath = path.join(__dirname, 'js', 'db.js');
const dbJsonDir = path.join(__dirname, 'backend');
const dbJsonPath = path.join(dbJsonDir, 'database.json');

if (!fs.existsSync(dbJsonDir)) {
  fs.mkdirSync(dbJsonDir);
}

// Mock window object to execute js/db.js and extract fallbackDB
global.window = {};
require(dbJsPath);

const mockDB = global.window.fallbackDB;

// Generate some default reviews for each product to make it look premium out-of-the-box
const reviews = [];
mockDB.products.forEach(p => {
  reviews.push(
    {
      id: 'rev-' + p.id + '-1',
      productId: p.id,
      name: "Aysel M.",
      rating: 5,
      text: `${p.title} məhsulundan çox razı qaldım, tamamilə təbii kənd dadı verir. Qablaşdırma da möhkəm və təmiz idi.`,
      date: "14 İyun 2026"
    },
    {
      id: 'rev-' + p.id + '-2',
      productId: p.id,
      name: "Elvin T.",
      rating: 5,
      text: `Uşaqlar üçün aldıq, çox bəyəndilər. Qatqısız olduğu dadından dərhal hiss olunur. Çatdırılma da vaxtında gəldi.`,
      date: "08 İyun 2026"
    }
  );
});

// Default blogs
const blogs = [
  {
    id: 'blog1',
    slug: 'orqanik-qidalarin-insan-saglamligina-5-faydasi',
    title: 'Orqanik Qidaların İnsan Sağlamlığına 5 Faydası',
    content: 'Təbii və orqanik qidalanma bədənin immunitetini artırır, toksinləri təmizləyir və enerji balansını qoruyur. Kənd məhsulları süni gübrəsiz yetişdirildiyi üçün vitaminlərlə zəngindir.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    date: '15 İyun 2026'
  },
  {
    id: 'blog2',
    slug: 'esl-kend-pendirini-magaza-pendirinden-nece-ayirmali',
    title: 'Əsl Kənd Pendirini Mağaza Pendirindən Necə Ayırmalı?',
    content: 'Əsl kənd pendiri kəsildikdə içində kiçik hava boşluqları olur və özünəməxsus saf süd ətri verir. Mağaza pendirlərində isə çox vaxt qoruyucular dadı dəyişir.',
    image: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&w=800&q=80',
    date: '10 İyun 2026'
  },
  {
    id: 'blog3',
    slug: 'xalis-suzme-balin-en-sade-ev-testleri',
    title: 'Xalis Süzmə Balın ən Sadə Ev Testləri',
    content: 'Xalis balı bir stəkan suya tökdükdə dağılmadan birbaşa dibinə çökməlidir. Həmçinin oda tutduqda alışıb yanması onun təmizliyinin digər göstəricisidir.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    date: '05 İyun 2026'
  }
];

const settings = {
  storeName: 'Kənd Bazarı',
  phone: '+994 50 123 45 67',
  email: 'info@kendbazari.az',
  address: 'Bakı şəhəri, Nizami küçəsi 45',
  shippingCost: 0,
  taxRate: 20,
  promocodes: [
    { code: 'KEND10', discount: 10, type: 'percent' },
    { code: 'BAZAR5', discount: 5, type: 'fixed' }
  ]
};

const initialData = {
  categories: mockDB.categories,
  products: mockDB.products,
  producers: mockDB.producers,
  orders: [],
  adminUsers: [
    { username: 'admin', password: '123' }
  ],
  reviews: reviews,
  blogs: blogs,
  settings: settings
};

fs.writeFileSync(dbJsonPath, JSON.stringify(initialData, null, 2), 'utf-8');
console.log('Database re-initialized successfully with extended tables at backend/database.json');
