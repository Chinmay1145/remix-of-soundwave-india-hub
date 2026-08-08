import { products } from './products';
import type { Product } from './store';

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  filter: (p: Product) => boolean;
  sort?: (a: Product, b: Product) => number;
}

export const collections: Collection[] = [
  {
    slug: 'editors-picks',
    name: "Editor's Picks",
    tagline: 'Tested, ranked, approved',
    description:
      'The gear our audio team actually keeps on their desks. Every pick here cleared a full week of listening tests for tuning, comfort and build.',
    accent: 'from-primary/25',
    filter: (p) => p.rating >= 4.4,
    sort: (a, b) => b.rating - a.rating,
  },
  {
    slug: 'new-arrivals',
    name: 'New Arrivals',
    tagline: 'Fresh off the shelf',
    description:
      'The latest drops to land at SoundWave — newest tuning, newest chipsets, newest colourways. Refreshed every week.',
    accent: 'from-[hsl(35_100%_55%)]/25',
    filter: () => true,
    sort: (a, b) => Number(b.id) - Number(a.id),
  },
  {
    slug: 'best-value',
    name: 'Best Value',
    tagline: 'Maximum sound per rupee',
    description:
      'Steepest discounts on gear that still punches well above its price. Ideal first upgrade or a second pair for the gym bag.',
    accent: 'from-emerald-500/20',
    filter: (p) => p.discount >= 30,
    sort: (a, b) => b.discount - a.discount,
  },
  {
    slug: 'anc-elite',
    name: 'ANC Elite',
    tagline: 'Silence on demand',
    description:
      'Active noise cancelling picks for flights, open offices and noisy commutes. Hybrid ANC, deep seals and transparency modes.',
    accent: 'from-sky-500/20',
    filter: (p) => p.anc,
    sort: (a, b) => b.rating - a.rating,
  },
];

export const getCollection = (slug: string) =>
  collections.find((c) => c.slug === slug);

export const getCollectionProducts = (collection: Collection, limit?: number) => {
  const list = products.filter(collection.filter);
  if (collection.sort) list.sort(collection.sort);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};