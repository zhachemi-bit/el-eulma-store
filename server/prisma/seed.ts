import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear all data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Database cleared');

  // 1. Create Vendors
  const vendorsData = [
    {
      name: 'ElectroPlus El Eulma',
      email: 'vendor@electroplus.dz',
      phone: '+213 555 123 456',
      location: 'Dubai Street, El Eulma',
      rating: 0,
      verified: true,
      status: 'approved',
      productCount: 18,
      registrationNumber: 'RC-001234',
      description: 'Leading electronics retailer in El Eulma',
      latitude: 36.155,
      longitude: 5.692,
      logo: null,
    },
    {
      name: 'Home Appliances Center',
      email: 'info@homeappliances.dz',
      phone: '+213 555 234 567',
      location: 'Dubai Street, El Eulma',
      rating: 0,
      verified: true,
      status: 'approved',
      productCount: 18,
      registrationNumber: 'RC-005678',
      description: 'Premium home appliances dealer',
      latitude: 36.158,
      longitude: 5.695,
      logo: null,
    },
    {
      name: 'Mobile World',
      email: 'sales@mobileworld.dz',
      phone: '+213 555 345 678',
      location: 'Dubai Street, El Eulma',
      rating: 0,
      verified: true,
      status: 'approved',
      productCount: 18,
      registrationNumber: 'RC-009012',
      description: 'Authorized mobile phone dealer',
      latitude: 36.152,
      longitude: 5.689,
      logo: null,
    },
    {
      name: 'Kitchen & Home El Eulma',
      email: 'kitchen@eleulma.dz',
      phone: '+213 555 456 789',
      location: 'Dubai Street, El Eulma',
      rating: 0,
      verified: true,
      status: 'approved',
      productCount: 18,
      registrationNumber: 'RC-004321',
      description: 'Everything for your kitchen and home',
      latitude: 36.150,
      longitude: 5.698,
      logo: null,
    }
  ];

  const createdVendors = [];
  for (const v of vendorsData) {
    const created = await prisma.vendor.create({ data: v });
    createdVendors.push(created);
  }

  console.log('✓ 4 Vendors created');

  // 2. Define 6 Categories
  const sections = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'appliances', name: 'Appliances' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'home-decor', name: 'Home Decor' },
    { id: 'phones', name: 'Phones & Tablets' },
    { id: 'computing', name: 'Computing' }
  ];

  // 3. Define Template Products for each category 
  const categoryTemplates: Record<string, any[]> = {
    electronics: [
      { name: 'Samsung 65" QLED 4K TV', price: 145000, desc: 'Ultra HD Smart TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop' },
      { name: 'Sony WH-1000XM5', price: 65000, desc: 'Noise canceling headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop' },
      { name: 'Sony PlayStation 5', price: 115000, desc: 'Next-gen gaming console', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop' }
    ],
    appliances: [
      { name: 'Samsung French Door Fridge', price: 285000, desc: 'Large capacity Fridge', image: 'fridj_1.jpg' },
      { name: 'LG Front Load Washer', price: 85000, desc: 'AI DD technology', image: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=800&auto=format&fit=crop' },
      { name: 'Panasonic Inverter Microwave', price: 45000, desc: 'Precision cooking', image: 'file:///home/zaki/Downloads/61459CAri+L._AC_SL1500_.jpg' }
    ],
    kitchen: [
      { name: 'KitchenAid Artisan Mixer', price: 75000, desc: 'Professional Mixer', image: 'file:///home/zaki/Downloads/QuuEvHVfSJwJTKNyobiuXG.jpg' },
      { name: 'Nespresso Vertuo Pop', price: 22000, desc: 'Compact coffee machine', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop' },
      { name: 'Philips Air Fryer XXL', price: 48000, desc: '90% less fat frying', image: 'file:///home/zaki/Downloads/68ZQ6F8RveQCTVEb6ZFQKd.jpg' }
    ],
    'home-decor': [
      { name: 'Modern Velvet Sofa', price: 125000, desc: 'Luxury 3-seater', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop' },
      { name: 'Nordic Floor Lamp', price: 18500, desc: 'Minimalist lighting', image: 'file:///home/zaki/Downloads/S6d20d844293d4e06a9deb702494ed827Q_600x.png' },
      { name: 'Abstract Wall Art', price: 12000, desc: 'Modern canvas painting', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop' }
    ],
    phones: [
      { name: 'iPhone 15 Pro Max', price: 245000, desc: 'Titanium design, A17 Pro', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop' },
      { name: 'Samsung S24 Ultra', price: 185000, desc: 'Integrated Galaxy AI', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop' },
      { name: 'iPad Air M2', price: 110000, desc: 'Powerful and colorful', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop' }
    ],
    computing: [
      { name: 'MacBook Pro 14" M3', price: 325000, desc: 'Ultimate pro performance', image: 'https://cdn.mos.cms.futurecdn.net/uFwvuYRtEHiWcoqQ45a83f.jpg' },
      { name: 'ASUS ROG Zephyrus G14', price: 245000, desc: 'Extreme gaming power', image: 'https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?q=80&w=800&auto=format&fit=crop' },
      { name: 'Samsung ViewFinity S9', price: 185000, desc: '5K Professional monitor', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop' }
    ]
  };

  // 4. Create Products (Exactly 3 per category)
  let productCount = 0;
  const fireOffersAdded = new Set();

  for (const section of sections) {
    const templates = categoryTemplates[section.id];
    // Keep exactly 3
    const selectedTemplates = templates.slice(0, 3);

    for (let i = 0; i < selectedTemplates.length; i++) {
      const vendor = createdVendors[i % createdVendors.length];
      const template = selectedTemplates[i];

      // Every 6th product becomes a Fire Offer (Liquidation)
      const isFireOffer = (productCount % 6 === 0);
      const originalPrice = isFireOffer ? template.price * 1.5 : null;

      await prisma.product.create({
        data: {
          name: template.name,
          description: template.desc || `High quality ${section.name}`,
          price: template.price,
          originalPrice: originalPrice,
          images: JSON.stringify([template.image]),
          category: section.id,
          subcategory: section.id,
          vendorId: vendor.id,
          stock: 100,
          rating: 0,
          reviewCount: 0,
          minOrderQuantity: 10, // Wholesale minimum
          specifications: JSON.stringify({
            Brand: template.name.split(' ')[0],
            Origin: 'International',
            Warranty: '12 Months',
            Availability: 'In Stock'
          })
        }
      });
      productCount++;
    }
  }

  console.log(`✓ Total ${productCount} products created (with Fire Offers scattered)`);

  // 5. Create Default Users
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // 5.1 Admin User
  await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // 5.2 Vendor Users (One for each created vendor)
  for (const v of createdVendors) {
    await prisma.user.create({
      data: {
        email: v.email,
        name: v.name,
        password: vendorPassword,
        role: 'vendor',
        vendorId: v.id,
      },
    });
  }

  // 5.3 Customer Users
  const customers = [
    { email: 'customer@example.com', name: 'Zaki Customer' },
    { email: 'retailer@shop.dz', name: 'El Eulma Retailer' },
    { email: 'user@user.com', name: 'Standard User' }
  ];

  for (const customer of customers) {
    await prisma.user.create({
      data: {
        email: customer.email,
        name: customer.name,
        password: userPassword,
        role: 'user',
      },
    });
  }

  console.log('✓ Default Admin, Vendors, and 3 Customers created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
