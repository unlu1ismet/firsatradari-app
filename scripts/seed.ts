import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateEAN13(baseDigits: string): string {
  const d = baseDigits.split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += d[i]! * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  return baseDigits + check;
}

const products = [
  { barcode12: '869012345601', title: 'Philips Airfryer XXL HD9270/90', brand: 'Philips', category: 'Küçük Ev Aletleri', imageUrl: 'https://ankurelectricals.com/cdn/shop/files/3_ec311fd0-7a96-45e3-b975-88091074756b.png?v=1729322513&width=1000', basePrice: 4999 },
  { barcode12: '869012345602', title: 'Xiaomi Robot Vacuum S10', brand: 'Xiaomi', category: 'Küçük Ev Aletleri', imageUrl: 'https://i.ebayimg.com/images/g/L2YAAOSwxXdm5V22/s-l1200.jpg', basePrice: 8499 },
  { barcode12: '869012345603', title: 'Onvo 50" 4K Ultra HD Smart TV', brand: 'Onvo', category: 'TV & Ses Sistemleri', imageUrl: 'https://appliancehub.mt/content/products/images/35507.jpg', basePrice: 7999 },
  { barcode12: '869012345604', title: 'Sony WH-1000XM5 Kablosuz Kulaklık', brand: 'Sony', category: 'Kulaklık & Ses', imageUrl: 'https://valueelectronics.com/wp-content/uploads/2022/05/WH-1000XM5_keyvisual_silver-Large-scaled.jpg', basePrice: 9299 },
  { barcode12: '869012345605', title: 'Logitech G305 Lightspeed Kablosuz Mouse', brand: 'Logitech', category: 'Bilgisayar & Aksesuar', imageUrl: 'https://m.media-amazon.com/images/I/51VF2HB5aLL.jpg', basePrice: 899 },
  { barcode12: '869012345606', title: "De'Longhi Dedica EC685 Espresso Makinesi", brand: "De'Longhi", category: 'Küçük Ev Aletleri', imageUrl: 'https://www.wholelattelove.com/cdn/shop/products/DedicaDeluxeBlack-Main.jpg?v=1640212900&width=1100', basePrice: 6799 },
  { barcode12: '869012345607', title: 'Arzum Okka Minio Türk Kahvesi Makinesi', brand: 'Arzum', category: 'Küçük Ev Aletleri', imageUrl: 'https://arzumusa.com/cdn/shop/products/Arzum_Okka_Minio_OK004-K_Siyah-Krom_530x@2x.jpg?v=1673695018', basePrice: 1899 },
  { barcode12: '869012345608', title: 'Dyson V15 Detect Kablosuz Süpürge', brand: 'Dyson', category: 'Küçük Ev Aletleri', imageUrl: 'https://www.nfm.com/dw/image/v2/BDFM_PRD/on/demandware.static/-/Sites-nfm-master-catalog/default/dwfdc1b73e/images/070/36/70366323-1.jpg?sw=1000&sh=1000&sm=fit', basePrice: 19999 },
  { barcode12: '869012345609', title: 'Samsung Galaxy A54 128GB Akıllı Telefon', brand: 'Samsung', category: 'Telefon & Aksesuar', imageUrl: 'https://www.mymobiles.com/assets/images/products/galaxy-a54-deals-white.webp', basePrice: 11999 },
  { barcode12: '869012345610', title: 'Apple iPhone 15 128GB', brand: 'Apple', category: 'Telefon & Aksesuar', imageUrl: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1695113801-apple-iphone-15-pro-lineup-white-titanium-twitter-650961d6e60d6.jpg?crop=1xw:1xh;center,top&resize=980:*', basePrice: 42999 },
  { barcode12: '869012345611', title: 'Bosch Serie 4 Çamaşır Makinesi 9kg', brand: 'Bosch', category: 'Beyaz Eşya', imageUrl: 'https://dmau.imgix.net/media/catalog/product/w/a/wan28227au_stp_master.jpg?trim=color&trimtol=10&fill=solid&bg=white&w=380&h=380&dpr=3&pad-top=52&pad-right=52&pad-bottom=0&pad-left=52&auto=format%2Ccompress&fit=fill&fill-color=ffffff&q=70', basePrice: 14999 },
  { barcode12: '869012345612', title: 'Karaca Hatır Hüps Türk Kahvesi Makinesi', brand: 'Karaca', category: 'Küçük Ev Aletleri', imageUrl: 'https://prenseshome.com/cdn/shop/files/9BD967B3-1641-4A14-92B6-9F0A6195E87F.webp?v=1779202570&width=1920', basePrice: 1299 },
  { barcode12: '869012345613', title: 'Xiaomi Mi Band 8 Akıllı Bileklik', brand: 'Xiaomi', category: 'Giyilebilir Teknoloji', imageUrl: 'https://mstore.ie/wp-content/uploads/2023/11/Xiaomi-Smart-Band-8-BlK.webp', basePrice: 799 },
  { barcode12: '869012345614', title: 'JBL Flip 6 Bluetooth Hoparlör', brand: 'JBL', category: 'Kulaklık & Ses', imageUrl: 'https://i.pcmag.com/imagery/articles/030ypXthyqtG76wf1sS8bRm-2.fit_lim.size_1050x.jpg', basePrice: 2999 },
  { barcode12: '869012345615', title: 'Vestel 55" 4K Ultra HD Smart TV', brand: 'Vestel', category: 'TV & Ses Sistemleri', imageUrl: 'https://www.vestel.com/cdn/shop/files/10146998_r1.jpg?v=1765367484&width=2048', basePrice: 9499 },
];

const merchants = ['Amazon', 'Trendyol', 'Hepsiburada', 'A101', 'BİM', 'Şok'];

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function merchantUrl(merchant: string, title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-');
  switch (merchant) {
    case 'Amazon': return `https://www.amazon.com.tr/dp/${slug}`;
    case 'Trendyol': return `https://www.trendyol.com/p/${slug}`;
    case 'Hepsiburada': return `https://www.hepsiburada.com/${slug}`;
    case 'A101': return `https://www.a101.com.tr/${slug}`;
    case 'BİM': return `https://www.bim.com.tr/${slug}`;
    case 'Şok': return `https://www.sokmarket.com.tr/${slug}`;
    default: return `https://example.com/${slug}`;
  }
}

// Flyer deals: products that appear in A101/BİM/Şok weekly aktüel
const flyerProductIndices = [0, 4, 6, 7, 11, 12]; // indices in products array

// Fake discount products: price was inflated before the "discount"
const fakeDiscountIndices = [2, 9]; // Onvo TV, iPhone 15

// All-time low products
const allTimeLowIndices = [0, 3, 5, 13]; // Airfryer, Sony, DeLonghi, JBL

async function main() {
  const now = new Date();

  for (let pi = 0; pi < products.length; pi++) {
    const p = products[pi]!;
    const barcode = generateEAN13(p.barcode12);

    // Determine lowest historical price
    const isFakeDiscount = fakeDiscountIndices.includes(pi);
    const isAllTimeLow = allTimeLowIndices.includes(pi);
    const lowestHistorical = isAllTimeLow ? p.basePrice * 0.85 : p.basePrice * 0.9;

    const product = await prisma.product.upsert({
      where: { barcode },
      update: { title: p.title, brand: p.brand, category: p.category, imageUrl: p.imageUrl, lowestHistoricalPrice: lowestHistorical },
      create: { barcode, title: p.title, brand: p.brand, category: p.category, imageUrl: p.imageUrl, lowestHistoricalPrice: lowestHistorical },
    });

    // Merchant prices - each product carried by 3-6 merchants
    const availableMerchants = merchants.filter(() => Math.random() > 0.15);
    // Ensure at least 3
    while (availableMerchants.length < 3) {
      const m = merchants[Math.floor(Math.random() * merchants.length)]!;
      if (!availableMerchants.includes(m)) availableMerchants.push(m);
    }

    const isFlyerProduct = flyerProductIndices.includes(pi);

    for (const merchant of availableMerchants) {
      let price: number;
      let originalPrice: number | null = null;
      let isFlyerDeal = false;
      let flyerDate: Date | null = null;

      const isMarket = ['A101', 'BİM', 'Şok'].includes(merchant);

      if (isFakeDiscount && !isMarket) {
        // Fake discount: original price was inflated 2 weeks ago
        originalPrice = Math.round(p.basePrice * 1.3);
        price = Math.round(p.basePrice * randomBetween(0.95, 1.05));
      } else if (isAllTimeLow && !isMarket) {
        price = Math.round(lowestHistorical * randomBetween(1.0, 1.02));
        originalPrice = Math.round(p.basePrice * randomBetween(1.1, 1.2));
      } else if (isMarket && isFlyerProduct) {
        // Market flyer deal - usually cheaper
        price = Math.round(p.basePrice * randomBetween(0.75, 0.88));
        originalPrice = p.basePrice;
        isFlyerDeal = true;
        // Set flyer date to this week
        const dayOfWeek = now.getDay();
        if (merchant === 'A101') {
          // Thursday
          const daysUntilThursday = (4 - dayOfWeek + 7) % 7;
          flyerDate = new Date(now);
          flyerDate.setDate(now.getDate() + (daysUntilThursday === 0 ? 0 : daysUntilThursday));
        } else if (merchant === 'BİM') {
          // Friday
          const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
          flyerDate = new Date(now);
          flyerDate.setDate(now.getDate() + (daysUntilFriday === 0 ? 0 : daysUntilFriday));
        } else {
          // Şok - Wednesday
          const daysUntilWednesday = (3 - dayOfWeek + 7) % 7;
          flyerDate = new Date(now);
          flyerDate.setDate(now.getDate() + (daysUntilWednesday === 0 ? 0 : daysUntilWednesday));
        }
      } else {
        price = Math.round(p.basePrice * randomBetween(0.9, 1.15));
        if (Math.random() > 0.5) {
          originalPrice = Math.round(price * randomBetween(1.1, 1.3));
        }
      }

      const stockStatus = Math.random() > 0.1 ? 'in_stock' : 'out_of_stock';

      // Use upsert with a composite key workaround
      const existing = await prisma.merchantPrice.findFirst({
        where: { productId: product.id, merchantName: merchant },
      });

      if (existing) {
        await prisma.merchantPrice.update({
          where: { id: existing.id },
          data: { price, originalPrice, stockStatus, productUrl: merchantUrl(merchant, p.title), isFlyerDeal, flyerDate },
        });
      } else {
        await prisma.merchantPrice.create({
          data: { productId: product.id, merchantName: merchant, price, originalPrice, stockStatus, productUrl: merchantUrl(merchant, p.title), isFlyerDeal, flyerDate },
        });
      }
    }

    // Price history - 60 days
    for (let day = 60; day >= 0; day--) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      date.setHours(12, 0, 0, 0);

      let histPrice: number;

      if (isFakeDiscount) {
        // Price was stable, then inflated 20 days ago, then "discounted" 5 days ago
        if (day > 20) {
          histPrice = p.basePrice * randomBetween(0.95, 1.02);
        } else if (day > 5) {
          histPrice = p.basePrice * randomBetween(1.25, 1.35);
        } else {
          histPrice = p.basePrice * randomBetween(0.95, 1.05);
        }
      } else if (isAllTimeLow) {
        // Gradual decline to current all-time low
        const progress = (60 - day) / 60;
        const startPrice = p.basePrice * 1.15;
        const endPrice = lowestHistorical;
        histPrice = startPrice - (startPrice - endPrice) * progress + randomBetween(-p.basePrice * 0.02, p.basePrice * 0.02);
      } else {
        // Normal fluctuation
        histPrice = p.basePrice * randomBetween(0.88, 1.12);
      }

      histPrice = Math.round(histPrice);

      const existing = await prisma.priceHistory.findFirst({
        where: { productId: product.id, date },
      });
      if (!existing) {
        await prisma.priceHistory.create({
          data: { productId: product.id, date, price: histPrice },
        });
      }
    }
  }

  // Seed some demo tracked items
  const allProducts = await prisma.product.findMany({ take: 5 });
  for (const prod of allProducts) {
    await prisma.trackedItem.upsert({
      where: { id: prod.id },
      update: {},
      create: {
        userId: 'demo-user',
        productId: prod.id,
        targetPrice: Math.round(prod.lowestHistoricalPrice * 0.95),
        status: 'active',
      },
    });
  }

  // Seed click analytics
  for (const merchant of merchants) {
    for (let i = 0; i < Math.floor(Math.random() * 50 + 10); i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const clickDate = new Date(now);
      clickDate.setDate(now.getDate() - daysAgo);
      await prisma.clickAnalytics.create({
        data: {
          merchantName: merchant,
          productId: allProducts[Math.floor(Math.random() * allProducts.length)]!.id,
          clickedAt: clickDate,
        },
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
