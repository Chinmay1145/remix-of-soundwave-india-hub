import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';
import twsCategory from '@/assets/tws-category.jpg';
import neckbandCategory from '@/assets/neckband-category.jpg';
import headphonesCategory from '@/assets/headphones-category.jpg';
import gamingCategory from '@/assets/gaming-category.jpg';

import type { Product } from './store';

export const products: Product[] = [
  {
    id: '1',
    name: 'Airdopes 441 Pro',
    brand: 'boAt',
    category: 'TWS',
    price: 1499,
    originalPrice: 3990,
    discount: 62,
    image: product1,
    rating: 4.5,
    reviews: 12543,
    batteryLife: '150H',
    bluetooth: '5.3',
    anc: true,
    colors: ['Black', 'Orange', 'Blue'],
    description: 'Experience true wireless freedom with boAt Airdopes 441 Pro. Featuring Active Noise Cancellation, immersive audio, and up to 150 hours of playback time.',
    features: ['Active Noise Cancellation', 'BEAST Mode for Gaming', 'ENx Technology', 'IPX5 Water Resistant', 'Touch Controls'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Rockerz 255 Max',
    brand: 'boAt',
    category: 'Neckband',
    price: 1299,
    originalPrice: 2990,
    discount: 57,
    image: product2,
    rating: 4.3,
    reviews: 8234,
    batteryLife: '60H',
    bluetooth: '5.2',
    anc: false,
    colors: ['Black', 'Red', 'Grey'],
    description: 'The boAt Rockerz 255 Max delivers powerful audio with 60 hours of playtime. Perfect for workouts and daily commute.',
    features: ['Magnetic Earbuds', 'Dual Pairing', 'Fast Charge', 'IPX5 Rating', 'Qualcomm aptX'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Nirvana 751 ANC',
    brand: 'boAt',
    category: 'Headphones',
    price: 2999,
    originalPrice: 7990,
    discount: 62,
    image: product3,
    rating: 4.6,
    reviews: 5678,
    batteryLife: '65H',
    bluetooth: '5.3',
    anc: true,
    colors: ['Black', 'White'],
    description: 'Premium over-ear wireless headphones with Hybrid Active Noise Cancellation. Crystal clear audio meets unmatched comfort.',
    features: ['Hybrid ANC', '40mm Drivers', 'ASAP Charge', 'Ambient Mode', 'Foldable Design'],
    inStock: true,
  },
  {
    id: '4',
    name: 'ColorBuds 2 Pro',
    brand: 'Noise',
    category: 'TWS',
    price: 2499,
    originalPrice: 4999,
    discount: 50,
    image: product4,
    rating: 4.4,
    reviews: 3456,
    batteryLife: '35H',
    bluetooth: '5.2',
    anc: true,
    colors: ['Pearl White', 'Rose Gold', 'Space Black'],
    description: 'Noise ColorBuds 2 Pro with Hybrid ANC and transparency mode. Premium design meets exceptional sound quality.',
    features: ['Hybrid ANC', 'Transparency Mode', 'Instacharge', 'Touch Controls', 'IPX5 Rating'],
    inStock: true,
  },
  {
    id: '5',
    name: 'AirPods Pro X',
    brand: 'Mivi',
    category: 'TWS',
    price: 1799,
    originalPrice: 3999,
    discount: 55,
    image: product5,
    rating: 4.2,
    reviews: 7890,
    batteryLife: '50H',
    bluetooth: '5.3',
    anc: true,
    colors: ['Midnight Blue', 'Black', 'White'],
    description: 'Mivi AirPods Pro X with premium sound quality and active noise cancellation. Made in India with pride.',
    features: ['ANC', 'ENC for Calls', 'Fast Pairing', 'Type-C Charging', 'Gaming Mode'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Warbuds X Gaming',
    brand: 'Boult',
    category: 'Gaming',
    price: 3499,
    originalPrice: 6999,
    discount: 50,
    image: product6,
    rating: 4.7,
    reviews: 2345,
    batteryLife: '45H',
    bluetooth: '5.3',
    anc: true,
    colors: ['RGB Black', 'Red', 'Green'],
    description: 'Ultimate gaming headset with 7.1 surround sound, RGB lighting, and ultra-low latency for competitive gaming.',
    features: ['7.1 Surround Sound', 'RGB Lighting', '40ms Low Latency', 'Detachable Mic', 'Memory Foam Cushions'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Buds Z Pro',
    brand: 'Realme',
    category: 'TWS',
    price: 2999,
    originalPrice: 4999,
    discount: 40,
    image: product1,
    rating: 4.5,
    reviews: 6789,
    batteryLife: '38H',
    bluetooth: '5.2',
    anc: true,
    colors: ['Silent Grey', 'Punk Yellow'],
    description: 'Realme Buds Z Pro with Sony LDAC codec for Hi-Res audio. Experience studio-quality sound on the go.',
    features: ['Sony LDAC', 'Active Noise Cancellation', 'Transparency Mode', 'Bass Boost+', 'IPX4 Rating'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Thunder 65',
    brand: 'Zebronics',
    category: 'Headphones',
    price: 999,
    originalPrice: 2499,
    discount: 60,
    image: product3,
    rating: 4.0,
    reviews: 4567,
    batteryLife: '55H',
    bluetooth: '5.1',
    anc: false,
    colors: ['Black', 'Blue', 'Red'],
    description: 'Zebronics Thunder 65 wireless headphones with powerful bass and comfortable fit. Great value for money.',
    features: ['40mm Drivers', 'Soft Padded Cushions', 'Foldable Design', 'Voice Assistant', 'AUX Support'],
    inStock: true,
  },
];

export const categories = [
  { name: 'True Wireless', slug: 'tws', image: twsCategory, count: 45 },
  { name: 'Neckbands', slug: 'neckband', image: neckbandCategory, count: 32 },
  { name: 'Headphones', slug: 'headphones', image: headphonesCategory, count: 28 },
  { name: 'Gaming', slug: 'gaming', image: gamingCategory, count: 18 },
];

export const brands = [
  'boAt',
  'Noise',
  'Boult',
  'Mivi',
  'Zebronics',
  'pTron',
  'Realme',
  'OnePlus',
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(
    (product) => product.brand.toLowerCase() === brand.toLowerCase()
  );
};
