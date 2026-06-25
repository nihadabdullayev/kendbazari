// Intercept all API calls in production to route to Render backend
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const baseUrl = isLocal ? '' : 'https://kendbazari.onrender.com';
      input = baseUrl + input;
    }
    return originalFetch(input, init);
  };
})();

window.fallbackDB = {
  producers: [
    {
      id: 'pr1',
      name: 'Məmməd Əmi',
      location: 'Gədəbəy, Azərbaycan',
      since: 1993,
      specialty: 'Dağ Balı və Arıçılıq',
      image: '/images/producers/mammad_ami.png',
      heroImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=80',
      bio: 'Məmməd əmi 30 ildən çoxdur ki, Gədəbəyin dağ yamaclarında arıçılıqla məşğul olur. Onun arıları yalnız təbii dağ çiçəklərindən şirə toplayır. Hər mövsüm yüzlərlə arı ailəsini əllə idarə edən Məmməd əmi, balın keyfiyyəti üçün heç vaxt güzəştə getmir. Ailə ənənəsini nəsildən-nəslə ötürməyə çalışır.',
      gallery: [
        'https://images.unsplash.com/photo-1471947186976-2527e979a036?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518317519338-e9aca0ba88a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['30+ il Təcrübə', 'Organik Sertifikatlı', 'Dağ Balı Ustadı']
    },
    {
      id: 'pr2',
      name: 'Fatma Xala',
      location: 'İsmayıllı, Azərbaycan',
      since: 2001,
      specialty: 'Nehrə Yağı və Süd Məhsulları',
      image: '/images/producers/fatma_xala.png',
      heroImage: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=1600&q=80',
      bio: 'Fatma xala İsmayıllı kəndinin ən məşhur nehrəçisidir. Saf kənd südündən nehrə yağı hazırlamaq üzrə 20 ildən artıq təcrübəyə malikdir. O, yağı tamamilə ənənəvi taxta nehrədə hazırlayır. Onun məhsulları Bakıya qədər maraq doğurur.',
      gallery: [
        'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['20+ il Təcrübə', 'Ənənəvi Nehrəçi', 'İsmayıllı Ustadı']
    },
    {
      id: 'pr3',
      name: 'Zəhra Nənə',
      location: 'Şirvan, Azərbaycan',
      since: 2005,
      specialty: 'Ev Quşçuluğu və Yumurta',
      image: '/images/producers/zahra_nana.png',
      heroImage: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=1600&q=80',
      bio: 'Zəhra nənə həyətindəki 50-dən çox yerli toyuğa xüsusi sevgi ilə baxır. Onun toyuqları tam sərbəst gəzərək yalnız təbii dən və otla bəslənirlər. Hər səhər toplanan yumurtalar gün içərisində müştərilərə çatdırılır. Zəhra nənə bu işi nənəsindən öyrənib.',
      gallery: [
        'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582212369602-b6f6b67e2d02?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['Ev Quşçuluğu', 'Günlük Təzə', 'Sərbəst Gəzən Toyuqlar']
    },
    {
      id: 'pr4',
      name: 'Vəli Əmi',
      location: 'Şəmkir, Azərbaycan',
      since: 1998,
      specialty: 'Açıq Sahə Tərəvəzçiliyi',
      image: '/images/producers/veli_ami.png',
      heroImage: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1600&q=80',
      bio: 'Vəli əmi Şəmkir rayonunda açıq sahə tərəvəzçiliyinin bilicisidir. O, pomidorları kimyəvi gübrələrdən uzaq, tam təbii quyu suyu və günəş altında yetişdirir. 25 illik fermerin ürəyi tarladır. Məhsullarının dadı ilə tanınan Vəli əmi hər mövsüm şəhərlilərin sevimlisidir.',
      gallery: [
        'https://images.unsplash.com/photo-1592921870789-04563d55041c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['25+ il Təcrübə', 'Kimyəvisiz Becərmə', 'Şəmkir Fermerı']
    },
    {
      id: 'pr5',
      name: 'Leyla Xala',
      location: 'Qəbələ, Azərbaycan',
      since: 2008,
      specialty: 'Meşə Meyvəsi Mürəbbələri',
      image: '/images/producers/leyla_xala.png',
      heroImage: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1600&q=80',
      bio: 'Leyla xala Qəbələnin meşələrindən yığılmış göyəmlərdən xüsusi reseptlə mürəbbələr hazırlayır. Onun mürəbbələrində heç bir kimyəvi qoruyucu istifadə edilmir. Hər dəfə mövsümündə meşəyə çıxıb özü yığır. Ənənəvi ev mürəbbəçiliyinin yaşayan nümunəsidir.',
      gallery: [
        'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['Meşə Meyvəsi Mütəxəssisi', 'Kimyəvisiz', 'Qəbələ Ustadı']
    },
    {
      id: 'pr6',
      name: 'Nüşabə Xala',
      location: 'Lerik, Azərbaycan',
      since: 2003,
      specialty: 'Təndir Çörəyi və Çörəkçilik',
      image: '/images/producers/nushaba_xala.png',
      heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
      bio: 'Nüşabə xala hər səhər saat 5-də duraraq təbii un və mayadan xəmir yoğurur. Onun gil təndirdə bişirdiyi çörəyin ətri bütün kəndə yayılır. Qədim reseptləri qoruyaraq bu ənənəni gənclərə öyrədir. Daş dəyirman ununu xüsusi sifarişlə alır.',
      gallery: [
        'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1558196723-1c0830087871?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1620921592232-3f2571adc7e8?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['Təndir Ustadı', 'Daş Dəyirman Unu', 'Ənənəvi Resept']
    },
    {
      id: 'pr7',
      name: 'Kamil Dayı',
      location: 'Qusar, Azərbaycan',
      since: 1990,
      specialty: 'Yaylaq Pendiri və Qoyunçuluq',
      image: '/images/producers/kamil_dayi.png',
      heroImage: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&w=1600&q=80',
      bio: 'Kamil dayı Qusarın yüksək yaylaqlarında qoyunçuluqla məşğuldur. Səbət pendirini qədim ailə resepti ilə yalnız saf yaylaq südündən hazırlayır. 35 illik sürü sahibi olan Kamil dayı hər yay ailə ilə birlikdə yaylağa çıxır. Onun pendirləri Qusarın simvolu sayılır.',
      gallery: [
        'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['35+ il Təcrübə', 'Yaylaq Pendiri', 'Qusar Ustadı']
    },
    {
      id: 'pr8',
      name: 'Səlim Əmi',
      location: 'Qax, Azərbaycan',
      since: 2010,
      specialty: 'Meşə Meyvəsi Qurutması',
      image: '/images/producers/salim_ami.png',
      heroImage: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1600&q=80',
      bio: 'Səlim əmi Qax rayonunun təmiz dağ havasında zoğalları əllə təmizləyib günəş altında qurudur. Onun məhsulları dadı və saflığı ilə tanınır. Qax meşəsindən hər mövsüm yüzlərlə kiloqram meşə meyvəsi yığır. Tamamilə kimyəvisiz qurutma üsulu ilə işləyir.',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1487530811015-780780169720?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565790815056-61bfd2da5869?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['Günəş Qurutması', 'Kimyəvisiz', 'Qax Meşəsi']
    },
    {
      id: 'pr9',
      name: 'Gülər Xala',
      location: 'Sabirabad, Azərbaycan',
      since: 2012,
      specialty: 'Əl işi Əriştə və Xəmir',
      image: '/images/producers/gular_xala.png',
      heroImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1600&q=80',
      bio: 'Gülər xala yerli kənd yumurtalarından və unundan istifadə edərək xəmiri əllə yayır və incə şəkildə kəsir. Hər kəsim əsl əl əməyidir. Hər gün erkən saatlarda xəmirini yoğurub günəş altında qurudur. Müştəriləri onu ən çox ürəkli xanım kimi tanıyırlar.',
      gallery: [
        'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: null,
      badges: ['Əl İşi', 'Ev Yumurtası', 'Ənənəvi Resept']
    }
  ],

  categories: [
    { 
      id: 'dairy',
      slug: 'sud-ve-agarti',
      name: 'Süd və Ağartı', 
      icon: '🥛',
      subcategories: ['Süd', 'Qatıq & Süzmə', 'Pendir', 'Yağ & Qaymaq'],
      descriptionTop: 'Təmiz dağ havasında, təbii otlarla bəslənən inək, qoyun və keçilərin saf südündən ənənəvi üsullarla hazırlanan kənd südü, nehrə yağı, səbət pendiri, süzmə və şor məhsulları. Hər gün təzə və təbii.',
      descriptionBottom: 'Süd və ağartı məhsullarımız tamamilə kənd şəraitində, heç bir kimyəvi qoruyucu və ya dadlandırıcı qatqı əlavə edilmədən hazırlanır. İsmayıllı, Qusar və digər rayonlarımızın zəngin yaylaqlarından süfrənizə gələn bu nemətlər kalsium və zülal mənbəyidir. Uşaqların qidalanması və sağlam yaşam üçün idealdır.'
    },
    { 
      id: 'produce',
      slug: 'meybe-tereevez',
      name: 'Meyvə və Tərəvəz', 
      icon: '🍎',
      subcategories: ['Meyvə', 'Tərəvəz', 'Göyərti', 'Quru Meyvələr'],
      descriptionTop: 'Azərbaycanın ən məhsuldar rayonlarından, birbaşa kəndli bağlarından toplanmış təzə meyvə, tərəvəz və göyərtilər. Süni gübrəsiz, təbii günəş altında yetişmiş ləzzətli kənd məhsulları.',
      descriptionBottom: 'Meyvə və tərəvəzlərimiz hər səhər tezdən yığılaraq gün ərzində xüsusi soyuduculu avtomobillərlə ünvanınıza çatdırılır. Şəmkir pomidoru, Gədəbəy kartofu kimi məşhur kənd nemətlərimiz vitaminsiz qalmamağınız üçün ən təbii seçimdir.'
    },
    { 
      id: 'honey-jam',
      slug: 'bal-ve-murebbeler',
      name: 'Bal və Mürəbbələr', 
      icon: '🍯',
      subcategories: ['Bal', 'Mürəbbə', 'Cem', 'Şərbət'],
      descriptionTop: 'Gədəbəy, Qax və Qəbələnin zəngin meşə və dağ bitkilərindən toplanmış 100% xalis süzmə bal, təbii petək balı və ev üsulu ilə şəkər balansı qorunaraq bişirilmiş ləzzətli mürəbbələr.',
      descriptionBottom: 'Təbii bal və mürəbbələrimiz immun sistemini gücləndirən, soyuqdəyməyə qarşı mükəmməl təbii vasitədir. Leyla xala, Məmməd əmi kimi təcrübəli kənd istehsalçılarımız tərəfindən ənənəvi ev reseptləri əsasında hazırlanan bu şirniyyatlar çay süfrələrinizə xüsusi ləzzət qatacaq.'
    },
    { 
      id: 'bakery-grains',
      slug: 'un-ve-taxil',
      name: 'Un və Taxıl', 
      icon: '🌾',
      subcategories: ['Çörək', 'Un', 'Dənli Bitkilər', 'Əriştə & Makaron'],
      descriptionTop: 'Daş dəyirmanda üyüdülmüş undan, təbii mayalanma üsulu ilə gil təndirdə odun atəşində bişirilmiş ətirli kənd çörəkləri, əl kəsimi ev əriştəsi və digər taxıl məhsulları.',
      descriptionBottom: 'Un və taxıl məhsullarımız liflərlə zəngin olub, həzm sisteminə olduqca faydalıdır. Qədim üsullarla hazırlanan təbii çörək və əriştələrimiz süfrənizə kənd təbiiliyini gətirir.'
    }
  ],
  products: [
    {
      id: 'p1',
      slug: 'tebii-dag-bali',
      title: 'Təbii Dağ Balı (Gədəbəy)',
      category: 'honey-jam',
      price: 35.00,
      oldPrice: 42.00,
      rating: 4.9,
      reviewsCount: 154,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1471947186976-2527e979a036?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Gədəbəyin yüksək dağlıq zonalarında, tamamilə təbii çiçəklərdən toplanmış xalis süzmə bal. Heç bir qatqı, şəkər şərbəti və ya konservant əlavə edilməyib. Laboratoriya analizlərindən keçmişdir.',
      colors: [
        { name: 'Şüşə Banka', hex: '#d97706' }
      ],
      sizes: ['500 q', '1 kq'],
      features: [
        '100% Xalis və Təbii Bal',
        'Gədəbəy Dağ Çiçəkləri',
        'Şüşə Qablaşdırma',
        'Diastas ədədi: 24+'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-DGB-01',
      producerId: 'pr1',
      producer: 'Məmməd Əmi',
      producerImage: '/images/producers/mammad_ami.png',
      producerBio: 'Məmməd əmi 30 ildən çoxdur ki, Gədəbəyin dağ yamaclarında arıçılıqla məşğul olur. Onun arıları yalnız təbii dağ çiçəklərindən şirə toplayır.'
    },
    {
      id: 'p2',
      slug: 'kend-nehre-yagi',
      title: 'Kənd Nehrə Yağı (İsmayıllı)',
      category: 'dairy',
      price: 18.50,
      oldPrice: null,
      rating: 4.8,
      reviewsCount: 92,
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'İsmayıllı rayonunun dağ kəndlərində, ənənəvi nehrə üsulu ilə hazırlanmış təbii kərə yağı. Saf kənd südünün qaymağından əldə edilir. Əla dad və ətir bəxş edir.',
      colors: [
        { name: 'Perqament Kağız', hex: '#fef3c7' }
      ],
      sizes: ['500 q', '1 kq', '2 kq'],
      features: [
        'Ənənəvi Nehrə Hazırlanması',
        'Qatqısız və Rəngsiz',
        'Zəngin Süd Dadı',
        'Soyuducuda Saxlanmalıdır'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-KNY-02',
      producerId: 'pr2',
      producer: 'Fatma Xala',
      producerImage: '/images/producers/fatma_xala.png',
      producerBio: 'Fatma xala İsmayıllı kəndində yaşayır və saf kənd südündən nehrə yağı hazırlamaq üzrə ustadır. O, yağı tamamilə ənənəvi taxta nehrədə hazırlayır.'
    },
    {
      id: 'p3',
      slug: 'tebii-kend-yumurtasi',
      title: 'Təbii Kənd Yumurtası (Ədəd)',
      category: 'dairy',
      price: 0.35,
      oldPrice: 0.40,
      rating: 4.7,
      reviewsCount: 240,
      image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Həyət şəraitində, təbii dən və otla bəslənən kənd toyuqlarının günlük təzə yumurtaları. Hər səhər təzə yığılaraq müştərilərə çatdırılır.',
      colors: [
        { name: 'Karton Qutu', hex: '#78350f' }
      ],
      sizes: ['10 Ədəd', '30 Ədəd'],
      features: [
        'Günlük Təzə Yığılır',
        'Təbii Bəslənmiş Toyuqlar',
        'Yüksək Protein Mənbəyi',
        'Təbii Sarılıq'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-TKY-03',
      producerId: 'pr3',
      producer: 'Zəhra Nənə',
      producerImage: '/images/producers/zahra_nana.png',
      producerBio: 'Zəhra nənə həyətindəki 50-dən çox yerli toyuğa xüsusi sevgi ilə baxır. Onun toyuqları tam sərbəst gəzərək yalnız təbii dən və otla bəslənirlər.'
    },
    {
      id: 'p4',
      slug: 'semkir-pomidoru',
      title: 'Şəmkir Pomidoru (Şirin)',
      category: 'produce',
      price: 3.20,
      oldPrice: 4.50,
      rating: 4.6,
      reviewsCount: 78,
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Məşhur Şəmkir pomidorları. Açıq sahədə, günəş altında yetişdirilmiş, nazik qabıqlı və ətirli pomidorlar. Həm salatlar, həm də yeməklər üçün idealdır.',
      colors: [
        { name: 'Taxta Səbət', hex: '#f97316' }
      ],
      sizes: ['1 kq', '3 kq', '5 kq'],
      features: [
        'Təbii Günəş Altında Yetişmə',
        'Şirin və Ətli Struktur',
        'Nazik Qabıqlı',
        'Hər Gün Təzə Dərilir'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-SMP-04',
      producerId: 'pr4',
      producer: 'Vəli Əmi',
      producerImage: '/images/producers/veli_ami.png',
      producerBio: 'Vəli əmi Şəmkir rayonunda açıq sahə tərəvəzçiliyinin bilicisidir. O, pomidorları kimyəvi gübrələrdən uzaq, tam təbii quyu suyu və günəş altında yetişdirir.'
    },
    {
      id: 'p5',
      slug: 'tebii-goyem-murebbesi',
      title: 'Təbii Göyəm Mürəbbəsi (Qəbələ)',
      category: 'honey-jam',
      price: 6.50,
      oldPrice: null,
      rating: 4.9,
      reviewsCount: 45,
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Qəbələ meşələrindən yığılmış yabani göyəmdən, ev şəraitində bişirilmiş turşməzə göyəm mürəbbəsi. Çay süfrələrinin əvəzolunmaz ləzzətidir.',
      colors: [
        { name: 'Şüşə Banka', hex: '#2e1065' }
      ],
      sizes: ['500 q', '1 kq'],
      features: [
        'Ev Şəraitində Hazırlanıb',
        'Meşə Göyəmi',
        'Heç Bir Kimyəvi Qatqısız',
        'Şəkər miqdarı balanslaşdırılıb'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-GMR-05',
      producerId: 'pr5',
      producer: 'Leyla Xala',
      producerImage: '/images/producers/leyla_xala.png',
      producerBio: 'Leyla xala Qəbələnin meşələrindən yığılmış göyəmlərdən xüsusi reseptlə mürəbbələr hazırlayır. Onun mürəbbələrində heç bir kimyəvi qoruyucu istifadə edilmir.'
    },
    {
      id: 'p6',
      slug: 'kend-tendir-choreyi',
      title: 'Kənd Təndir Çörəyi (Qara Un)',
      category: 'bakery-grains',
      price: 1.20,
      oldPrice: 1.50,
      rating: 4.8,
      reviewsCount: 112,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Təbii maya və daş dəyirmanda üyüdülmüş qara undan (kəpəkli) bişirilmiş əsl kənd təndir çörəyi. Gil təndirdə, odun atəşində hazırlanır.',
      colors: [
        { name: 'Kağız Paket', hex: '#b45309' }
      ],
      sizes: ['1 Ədəd (Böyük)'],
      features: [
        'Odun atəşində gil təndirdə',
        'Daş dəyirman unu',
        'Uzun müddət təzə qalır',
        'Təbii maya ilə yoğrulub'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-KTC-06',
      producerId: 'pr6',
      producer: 'Nüşabə Xala',
      producerImage: '/images/producers/nushaba_xala.png',
      producerBio: 'Nüşabə xala hər səhər saat 5-də duraraq təbii un və mayadan xəmir yoğurur. Onun gil təndirdə bişirdiyi çörəyin ətri bütün kəndə yayılır.'
    },
    {
      id: 'p7',
      slug: 'qusar-sebet-pendiri',
      title: 'Qusar Səbət Pendiri (Qoyun)',
      category: 'dairy',
      price: 14.00,
      oldPrice: 16.50,
      rating: 4.7,
      reviewsCount: 64,
      image: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1486887396153-fa416525c108?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Qusar yaylaqlarında otlayan qoyunların südündən, xüsusi toxunma səbətlərdə süzülərək hazırlanan duzlu dağ pendiri. 3 ay xüsusi şəraitdə yetişdirilir.',
      colors: [
        { name: 'Vakuum Paket', hex: '#e2e8f0' }
      ],
      sizes: ['500 q', '1 kq'],
      features: [
        'Qusar Yaylaq Qoyun Südü',
        'Ənənəvi Səbət Süzməsi',
        'Uzun müddət yetişdirilmiş',
        'Duzlu və Orta-Sərt'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-QSP-07',
      producerId: 'pr7',
      producer: 'Kamil Dayı',
      producerImage: '/images/producers/kamil_dayi.png',
      producerBio: 'Kamil dayı Qusarın yüksək yaylaqlarında qoyunçuluqla məşğuldur. Səbət pendirini qədim ailə resepti ilə yalnız saf yaylaq südündən hazırlayır.'
    },
    {
      id: 'p8',
      slug: 'tebii-zogal-axtasi',
      title: 'Təbii Zoğal Axtası (Qax)',
      category: 'honey-jam',
      price: 8.50,
      oldPrice: 10.00,
      rating: 4.9,
      reviewsCount: 38,
      image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Qax rayonunda günəş altında təbii üsulla qurudulmuş, tumsuz meşə zoğalı axtası. Tamamilə təbiidir, heç bir kükürd və ya konservant əlavə edilməmişdir.',
      colors: [
        { name: 'Xüsusi Torba', hex: '#7f1d1d' }
      ],
      sizes: ['250 q', '500 q'],
      features: [
        'Günəşdə Təbii Qurudulma',
        'Tumsuz və Təmiz meşə zoğalı',
        'Vitamin C ilə zəngin',
        'Qax kənd məhsuludur'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-ZGA-08',
      producerId: 'pr8',
      producer: 'Səlim Əmi',
      producerImage: '/images/producers/salim_ami.png',
      producerBio: 'Səlim əmi Qax rayonunun təmiz dağ havasında zoğalları əllə təmizləyib günəş altında qurudur. Onun məhsulları dadı və saflığı ilə tanınır.'
    },
    {
      id: 'p9',
      slug: 'tebii-ev-eristesi',
      title: 'Təbii Ev Əriştəsi (Əl kəsimi)',
      category: 'bakery-grains',
      price: 4.50,
      oldPrice: null,
      rating: 4.8,
      reviewsCount: 52,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
      images: [
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
      ],
      description: 'Kənd yumurtası və yüksək keyfiyyətli undan əllə yayılıb kəsilmiş ev əriştəsi. Sup və aş hazırlamaq üçün idealdır.',
      colors: [
        { name: 'Plastik Qutu', hex: '#cbd5e1' }
      ],
      sizes: ['500 q', '1 kq'],
      features: [
        'Əllə Yayılıb Kəsilmişdir',
        'Bol Kənd Yumurtası ilə',
        'Tamamilə Quru və Təmiz',
        'Heç bir qatqı maddəsi yoxdur'
      ],
      inStock: true,
      featured: true,
      sku: 'KB-TEA-09',
      producerId: 'pr9',
      producer: 'Gülər Xala',
      producerImage: '/images/producers/gular_xala.png',
      producerBio: 'Gülər xala yerli kənd yumurtalarından və unundan istifadə edərək xəmiri əllə yayır və incə şəkildə kəsir. Hər kəsim əsl əl əməyidir.'
    }
  ]
};

window.mockDB = null;

window.initDb = async function() {
  if (window.mockDB) return window.mockDB;
  try {
    const [products, categories, producers] = await Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/producers').then(r => r.json())
    ]);
    window.mockDB = { products, categories, producers };
    return window.mockDB;
  } catch (err) {
    console.error('Failed to fetch from API, falling back to local mock data:', err);
    window.mockDB = window.fallbackDB;
    return window.mockDB;
  }
};
