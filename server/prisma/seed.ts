/// <reference types="node" />
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

  // 1. Create 4 Vendors
  const vendorsData = [
    {
      name: 'ElectroPlus El Eulma',
      email: 'contact@electroplus.dz',
      phone: '+213 555 123 456',
      location: 'Dubai Street, El Eulma',
      rating: 4.8,
      verified: true,
      status: 'approved',
      productCount: 6,
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
      rating: 4.9,
      verified: true,
      status: 'approved',
      productCount: 6,
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
      rating: 4.7,
      verified: true,
      status: 'approved',
      productCount: 6,
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
      rating: 4.6,
      verified: true,
      status: 'approved',
      productCount: 6,
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
      { name: 'Samsung 65" QLED 4K TV', price: 145000, desc: 'Ultra HD Smart TV', tag: 'samsung-tv' },
      { name: 'Sony WH-1000XM5', price: 65000, desc: 'Noise canceling headphones', tag: 'headphones' },
      { name: 'LG OLED G3 55"', price: 195000, desc: 'The best OLED display', tag: 'tv-lg' },
      { name: 'Bose SoundLink', price: 42000, desc: '360 degree portable speaker', tag: 'speaker' }
    ],
    appliances: [
      { name: 'Samsung French Door Fridge', price: 285000, desc: 'Large capacity Fridge', tag: 'refrigerator' },
      { name: 'LG Front Load Washer', price: 85000, desc: 'AI DD technology', tag: 'washing-machine' },
      { name: 'Dyson V15 Detect', price: 115000, desc: 'Cordless vacuum', tag: 'vacuum-cleaner' },
      { name: 'Whirlpool Microwave', price: 35000, desc: 'Convection microwave', tag: 'microwave' }
    ],
    kitchen: [
      { name: 'KitchenAid Artisan Mixer', price: 75000, desc: 'Professional Mixer', tag: 'stand-mixer' },
      { name: 'Nespresso Vertuo Pop', price: 22000, desc: 'Compact coffee machine', tag: 'coffee-maker' },
      { name: 'Philips Air Fryer XXL', price: 48000, desc: '90% less fat frying', tag: 'air-fryer' },
      { name: 'Ninja Foodi Grill', price: 55000, desc: 'Indoor Grill and Air Fryer', tag: 'grill' }
    ],
    'home-decor': [
      { name: 'Modern Velvet Sofa', price: 125000, desc: 'Luxury 3-seater', tag: 'sofa' },
      { name: 'Nordic Floor Lamp', price: 18500, desc: 'Minimalist lighting', tag: 'lamp' },
      { name: 'Persian Style Rug', price: 45000, desc: 'Handcrafted pattern', tag: 'rug' },
      { name: 'Abstract Wall Art', price: 12000, desc: 'Modern canvas painting', tag: 'wall-art' }
    ],
    phones: [
      { name: 'iPhone 15 Pro Max', price: 245000, desc: 'Titanium design, A17 Pro', tag: 'iphone-15' },
      { name: 'Samsung S24 Ultra', price: 185000, desc: 'Integrated Galaxy AI', tag: 'galaxy-s24' },
      { name: 'Google Pixel 8 Pro', price: 135000, desc: 'Pure Android experience', tag: 'google-pixel' },
      { name: 'Xiaomi 14 Ultra', price: 145000, desc: 'Leica professional camera', tag: 'xiaomi-phone' }
    ],
    computing: [
      { name: 'MacBook Pro 14" M3', price: 325000, desc: 'Ultimate pro performance', tag: 'macbook-pro' },
      { name: 'ASUS ROG Zephyrus G14', price: 245000, desc: 'Extreme gaming power', tag: 'gaming-laptop' },
      { name: 'Dell XPS 13 Plus', price: 195000, desc: 'InfinityEdge display', tag: 'dell-xps' },
      { name: 'iPad Pro 12.9" M2', price: 215000, desc: 'Pro tablet computing', tag: 'ipad-pro' }
    ]
  };

  // 4. Create Products
  let productCount = 0;
  for (const section of sections) {
    const templates = categoryTemplates[section.id];
    
    for (let i = 0; i < 4; i++) {
        const vendor = createdVendors[i];
        const template = templates[i];
        
        // Guarantee at least 12 Fire Offers (every second product)
        const isFireOffer = (productCount % 2 === 0); 
        const price = template.price;
        const originalPrice = isFireOffer ? Math.floor(price * 1.4) : null;

        await prisma.product.create({
            data: {
                name: template.name,
                description: template.desc || `High quality ${section.name}`,
                price: price,
                originalPrice: originalPrice,
                images: JSON.stringify([`https://loremflickr.com/800/800/${template.tag || section.id}?lock=${productCount}`]),
                category: section.id,
                subcategory: section.id,
                vendorId: vendor.id,
                stock: 20,
                rating: 4.5,
                reviewCount: 12,
                specifications: JSON.stringify({
                    Brand: template.name.split(' ')[0],
                    Origin: 'International',
                    Warranty: '12 Months'
                })
            }
        });
        productCount++;
    }
  }

  console.log(`✓ Total ${productCount} Better Products created with matched images`);

  // 5. Create Users
  const adminHash = await bcrypt.hash('zaki', 10);
  const vendorHash = await bcrypt.hash('vendor123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@eleulmastore.dz',
      name: 'System Administrator',
      password: adminHash,
      role: 'admin',
    },
  });

  // Simple static admin for easy access
  await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'Main Admin',
      password: await bcrypt.hash('password123', 10),
      role: 'admin',
    },
  });

  for (let i = 0; i < createdVendors.length; i++) {
      const vendor = createdVendors[i];
      await prisma.user.create({
          data: {
              email: `owner_${i+1}@${vendor.email.split('@')[1]}`,
              name: `Owner of ${vendor.name}`,
              password: vendorHash,
              phone: vendor.phone,
              role: 'vendor',
              vendorId: vendor.id,
          }
      });
  }

  console.log('✓ Admin and Vendor Users created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
