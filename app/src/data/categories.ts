import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'TVs, Audio & More',
    image: '/images/categories/electronics.jpg',
    productCount: 1250
  },
  {
    id: 'appliances',
    name: 'Home Appliances',
    description: 'Fridges, Washers, ACs',
    image: '/images/categories/appliances.jpg',
    productCount: 980
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    description: 'Cookers, Microwaves',
    image: '/images/categories/kitchen.jpg',
    productCount: 750
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    description: 'Furniture & Lighting',
    image: '/images/categories/home-decor.jpg',
    productCount: 520
  },
  {
    id: 'phones',
    name: 'Phones & Tablets',
    description: 'Smartphones & Accessories',
    image: '/images/categories/phones.jpg',
    productCount: 890
  },
  {
    id: 'computing',
    name: 'Computing',
    description: 'Laptops & Accessories',
    image: '/images/categories/computing.jpg',
    productCount: 650
  }
];
