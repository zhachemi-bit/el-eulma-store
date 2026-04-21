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

  // 3. Define Template Products for each category (Expanded to 4 per vendor)
  const categoryTemplates: Record<string, any[]> = {
    electronics: [
      { name: 'Samsung 65" QLED 4K TV', price: 145000, desc: 'Ultra HD Smart TV', tag: 'samsung-tv' },
      { name: 'Sony WH-1000XM5', price: 65000, desc: 'Noise canceling headphones', tag: 'headphones' },
      { name: 'LG OLED G3 55"', price: 195000, desc: 'The best OLED display', tag: 'tv-lg' },
      { name: 'Bose SoundLink', price: 42000, desc: '360 degree portable speaker', tag: 'speaker' },
      { name: 'Sonos Beam Gen 2', price: 78000, desc: 'Compact smart soundbar', tag: 'soundbar' },
      { name: 'GoPro HERO12 Black', price: 85000, desc: 'Action camera', tag: 'gopro' },
      { name: 'Sony PlayStation 5', price: 115000, desc: 'Next-gen gaming console', tag: 'ps5' },
      { name: 'Nintendo Switch OLED', price: 68000, desc: 'Handheld gaming', tag: 'switch' },
      { name: 'DJI Mini 4 Pro', price: 155000, desc: 'Ultralight camera drone', tag: 'drone' },
      { name: 'Yamaha Soundbar', price: 35000, desc: 'Rich home theater sound', tag: 'audio' },
      { name: 'Canon EOS R50', price: 125000, desc: 'Mirrorless camera', tag: 'camera' },
      { name: 'Marshall Stanmore III', price: 48000, desc: 'Bluetooth home speaker', tag: 'marshall' },
      { name: 'Apple TV 4K', price: 32000, desc: 'Best streaming box', tag: 'appletv' },
      { name: 'Kindle Paperwhite', price: 28000, desc: 'E-reader with light', tag: 'kindle' },
      { name: 'Fitbit Charge 6', price: 25000, desc: 'Advanced fitness tracker', tag: 'fitbit' },
      { name: 'Nest Learning Thermostat', price: 38000, desc: 'Smart home control', tag: 'nest' }
    ],
    appliances: [
      { name: 'Samsung French Door Fridge', price: 285000, desc: 'Large capacity Fridge', tag: 'refrigerator' },
      { name: 'LG Front Load Washer', price: 85000, desc: 'AI DD technology', tag: 'washing-machine' },
      { name: 'Dyson V15 Detect', price: 115000, desc: 'Cordless vacuum', tag: 'vacuum-cleaner' },
      { name: 'Whirlpool Microwave', price: 35000, desc: 'Convection microwave', tag: 'microwave' },
      { name: 'Miele Dishwasher', price: 145000, desc: 'German engineering', tag: 'dishwasher' },
      { name: 'Shark Navigator', price: 42000, desc: 'Upright vacuum', tag: 'shark' },
      { name: 'Tefal Steam Iron', price: 12000, desc: 'Efficient ironing', tag: 'iron' },
      { name: 'DeLonghi Portable AC', price: 95000, desc: 'Silent cooling', tag: 'ac' },
      { name: 'Samsung Washer Dryer', price: 135000, desc: 'Combo laundry unit', tag: 'dryer' },
      { name: 'LG CordZero', price: 88000, desc: 'Stick vacuum cleaner', tag: 'lg-vacuum' },
      { name: 'Bosch Series 6 Washing Machine', price: 92000, desc: 'Quiet and efficient', tag: 'bosch' },
      { name: 'Panasonic Inverter Microwave', price: 45000, desc: 'Precision cooking', tag: 'microwave-p' },
      { name: 'Rowenta Air Purifier', price: 38000, desc: 'HEPA filtration', tag: 'air-purifier' },
      { name: 'Beko Tumble Dryer', price: 65000, desc: 'Fast drying', tag: 'beko' },
      { name: 'Candy Slim Washing Machine', price: 58000, desc: 'Perfect for small spaces', tag: 'candy' },
      { name: 'Hisense Beverage Cooler', price: 52000, desc: 'Compact fridge for drinks', tag: 'cooler' }
    ],
    kitchen: [
      { name: 'KitchenAid Artisan Mixer', price: 75000, desc: 'Professional Mixer', tag: 'stand-mixer' },
      { name: 'Nespresso Vertuo Pop', price: 22000, desc: 'Compact coffee machine', tag: 'coffee-maker' },
      { name: 'Philips Air Fryer XXL', price: 48000, desc: '90% less fat frying', tag: 'air-fryer' },
      { name: 'Ninja Foodi Grill', price: 55000, desc: 'Indoor Grill and Air Fryer', tag: 'grill' },
      { name: 'Sharp Solo Microwave', price: 18500, desc: 'Compact kitchen microwave', tag: 'microwave' },
      { name: 'Vitamix E310 Blender', price: 85000, desc: 'Professional grade blender', tag: 'blender' },
      { name: 'Breville Barista Express', price: 125000, desc: 'Espresso machine', tag: 'coffee' },
      { name: 'SMEG 2-Slice Toaster', price: 28000, desc: 'Retro design toaster', tag: 'toaster' },
      { name: 'Instant Pot Pro', price: 35000, desc: 'Multi-cooker', tag: 'cooker' },
      { name: 'NutriBullet Pro', price: 18000, desc: 'Compact personal blender', tag: 'nutribullet' },
      { name: 'Zojirushi Rice Cooker', price: 42000, desc: 'Perfect rice every time', tag: 'rice-cooker' },
      { name: 'SodaStream Terra', price: 15000, desc: 'Sparkling water maker', tag: 'sodastream' },
      { name: 'Magimix Food Processor', price: 68000, desc: 'Powerful food prep', tag: 'food-prop' },
      { name: 'Dualit Classic Toaster', price: 32000, desc: 'Hand-built British toaster', tag: 'dualit' },
      { name: 'Cuisinart Ice Cream Maker', price: 24000, desc: 'Homemade desserts', tag: 'ice-cream' },
      { name: 'Le Creuset Casserole', price: 45000, desc: 'Cast iron cookware', tag: 'pan' }
    ],
    'home-decor': [
      { name: 'Modern Velvet Sofa', price: 125000, desc: 'Luxury 3-seater', tag: 'sofa' },
      { name: 'Nordic Floor Lamp', price: 18500, desc: 'Minimalist lighting', tag: 'lamp' },
      { name: 'Persian Style Rug', price: 45000, desc: 'Handcrafted pattern', tag: 'rug' },
      { name: 'Abstract Wall Art', price: 12000, desc: 'Modern canvas painting', tag: 'wall-art' },
      { name: 'Oak Coffee Table', price: 35000, desc: 'Solid wood furniture', tag: 'table' },
      { name: 'Bamboo Bedding Set', price: 15000, desc: 'Sustainable comfort', tag: 'bedding' },
      { name: 'Ceramic Vase Set', price: 8000, desc: 'Decorative accents', tag: 'vase' },
      { name: 'Floating Bookshelf', price: 10000, desc: 'Space-saving design', tag: 'shelf' },
      { name: 'Mid-Century Armchair', price: 55000, desc: 'Classic retro style', tag: 'chair' },
      { name: 'Silk Blackout Curtains', price: 22000, desc: 'Elegant window treatment', tag: 'curtains' },
      { name: 'Aroma Diffuser', price: 6500, desc: 'Essential oil mister', tag: 'diffuser' },
      { name: 'Full-Length Mirror', price: 28000, desc: 'Minimalist gold frame', tag: 'mirror' },
      { name: 'Indoor Olive Tree', price: 18000, desc: 'Large artificial plant', tag: 'plant' },
      { name: 'Marble Side Table', price: 32000, desc: 'Contemporary elegance', tag: 'side-table' },
      { name: 'Woven Storage Baskets', price: 7500, desc: 'Natural organization', tag: 'basket' },
      { name: 'Feather Down Pillows', price: 12000, desc: 'Hotel quality sleep', tag: 'pillow' }
    ],
    phones: [
      { name: 'iPhone 15 Pro Max', price: 245000, desc: 'Titanium design, A17 Pro', tag: 'iphone-15' },
      { name: 'Samsung S24 Ultra', price: 185000, desc: 'Integrated Galaxy AI', tag: 'galaxy-s24' },
      { name: 'Google Pixel 8 Pro', price: 135000, desc: 'Pure Android experience', tag: 'google-pixel' },
      { name: 'Xiaomi 14 Ultra', price: 145000, desc: 'Leica professional camera', tag: 'xiaomi-phone' },
      { name: 'OnePlus 12', price: 115000, desc: 'Super fast charging', tag: 'oneplus' },
      { name: 'Nothing Phone 2', price: 85000, desc: 'Unique Glyph interface', tag: 'nothing-phone' },
      { name: 'Samsung Galaxy Z Fold 5', price: 265000, desc: 'The ultimate foldable', tag: 'fold' },
      { name: 'ASUS ROG Phone 8', price: 155000, desc: 'Extreme mobile gaming', tag: 'rog-phone' },
      { name: 'Sony Xperia 1 V', price: 165000, desc: 'Cinematic creator phone', tag: 'sony-xperia' },
      { name: 'Motorola Razr+', price: 125000, desc: 'Iconic flip design', tag: 'razr' },
      { name: 'iPad Air M2', price: 110000, desc: 'Powerful and colorful', tag: 'ipad-air' },
      { name: 'Samsung Tab S9 Ultra', price: 145000, desc: 'Mastery on a large screen', tag: 'tab-s9' },
      { name: 'Apple Watch Series 9', price: 75000, desc: 'Most advanced smartwatch', tag: 'apple-watch' },
      { name: 'Pixel Watch 2', price: 55000, desc: 'Help by Google, health by Fitbit', tag: 'pixel-watch' },
      { name: 'Garmin Epix Gen 2', price: 125000, desc: 'Premium adventure watch', tag: 'garmin' },
      { name: 'AirPods Pro 2', price: 42000, desc: 'Industry leading audio', tag: 'airpods' }
    ],
    computing: [
      { name: 'MacBook Pro 14" M3', price: 325000, desc: 'Ultimate pro performance', tag: 'macbook-pro' },
      { name: 'ASUS ROG Zephyrus G14', price: 245000, desc: 'Extreme gaming power', tag: 'gaming-laptop' },
      { name: 'Dell XPS 13 Plus', price: 195000, desc: 'InfinityEdge display', tag: 'dell-xps' },
      { name: 'iPad Pro 12.9" M2', price: 215000, desc: 'Pro tablet computing', tag: 'ipad-pro' },
      { name: 'Microsoft Surface Pro 9', price: 175000, desc: 'Versatile 2-in-1', tag: 'surface' },
      { name: 'Lenovo ThinkPad X1 Carbon', price: 225000, desc: 'Business standard', tag: 'thinkpad' },
      { name: 'HP Spectre x360', price: 185000, desc: 'Convertible elegance', tag: 'hp-spectre' },
      { name: 'Razer Blade 15', price: 345000, desc: 'Precision gaming laptop', tag: 'razer' },
      { name: 'Samsung ViewFinity S9', price: 185000, desc: '5K Professional monitor', tag: 'monitor' },
      { name: 'Logitech MX Master 3S', price: 18500, desc: 'Ergonomic productivity mouse', tag: 'mouse' },
      { name: 'Keychron Q1 Pro', price: 35000, desc: 'Mechanical keyboard perfection', tag: 'keyboard' },
      { name: 'WD Black 2TB NVMe SSD', price: 32000, desc: 'Blazing fast storage', tag: 'ssd' },
      { name: 'Synology DS923+ NAS', price: 95000, desc: 'Your private cloud', tag: 'nas' },
      { name: 'Nvidia RTX 4080', price: 185000, desc: 'Pro level graphics', tag: 'gpu' },
      { name: 'LG DualUp Monitor', price: 115000, desc: 'Unique 16:18 productivity', tag: 'lg-monitor' },
      { name: 'SteelSeries Arctis Nova Pro', price: 55000, desc: 'Ultimate gaming headset', tag: 'gaming-audio' }
    ]
  };

  // 4. Create Products (4 per vendor per category)
  let productCount = 0;
  for (const section of sections) {
    const templates = categoryTemplates[section.id];

    // Each category gets 16 products (4 per vendor)
    for (let i = 0; i < templates.length; i++) {
      // Distribute items across the 4 vendors
      const vendorIndex = i % 4;
      const vendor = createdVendors[vendorIndex];
      const template = templates[i];

      // Every 3rd product is a Fire Offer
      const isFireOffer = (productCount % 3 === 0);
      const price = template.price;
      const originalPrice = isFireOffer ? Math.floor(price * 1.3) : null;

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
          stock: Math.floor(Math.random() * 50) + 5,
          rating: 4 + Math.random(),
          reviewCount: Math.floor(Math.random() * 100),
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

  console.log(`✓ Total ${productCount} varied products created across 4 vendors`);

  // 5. Create Users
  // Default Admin User
  await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      name: 'System Administrator',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    },
  });

  // Default Seller/Vendor User (linked to ElectroPlus)
  const firstVendor = createdVendors[0];
  await prisma.user.create({
    data: {
      email: 'vendor@electroplus.dz',
      name: 'Test vendor',
      password: await bcrypt.hash('vendor123', 10),
      role: 'vendor',
      vendorId: firstVendor.id,
    },
  });

  // Default Customer User
  await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Test Customer',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
    },
  });

  for (let i = 0; i < createdVendors.length; i++) {
    const vendor = createdVendors[i];
    // Skip the first one as we already created a specific user for it
    if (i === 0) continue;

    await prisma.user.create({
      data: {
        email: `owner_${i + 1}@${vendor.email.split('@')[1]}`,
        name: `Owner of ${vendor.name}`,
        password: await bcrypt.hash('vendor123', 10),
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
