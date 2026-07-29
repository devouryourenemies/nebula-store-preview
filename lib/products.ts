export type ProductCategory = 'stacks' | 'individual-peptides' | 'accessories';

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  dosage: string;
  subtitle: string;
  summary: string;
  researchFocus: string[];
  composition: string[];
  highlights: string[];
  accent: 'cosmos' | 'supernova' | 'stardust' | 'horizon';
  unitPriceCents: number;
  featured?: boolean;
};

export const complianceDisclaimer = 'For research use only — not for human consumption.';

export const catalogCategories: {
  id: ProductCategory;
  name: string;
  description: string;
}[] = [
  {
    id: 'stacks',
    name: 'Stacks',
    description: 'Multi-compound peptide systems formulated for advanced research protocols.',
  },
  {
    id: 'individual-peptides',
    name: 'Individual Peptides',
    description: 'Single-compound research SKUs for precise study and protocol flexibility.',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Lab essentials including bacteriostatic water for reconstitution.',
  },
];

export const products: Product[] = [
  // ─── Recovery Stacks ───
  {
    slug: 'glow-stack',
    name: 'Glow Stack',
    shortName: 'Glow Stack',
    category: 'stacks',
    dosage: '70MG',
    subtitle: 'BPC-157 + TB-500 + GHK-Cu',
    summary: 'A premium recovery-focused stack combining BPC-157, TB-500, and GHK-Cu for comprehensive tissue repair, gut health, and collagen synthesis research.',
    researchFocus: ['Tissue repair', 'Gut health', 'Muscle recovery', 'Collagen synthesis', 'Skin rejuvenation'],
    composition: ['BPC-157', 'TB-500', 'GHK-Cu'],
    highlights: ['Stacked formulation', 'Premium clinical presentation', 'Multi-compound synergy'],
    accent: 'supernova',
    unitPriceCents: 12999,
    featured: true,
  },
  {
    slug: 'klow-stack',
    name: 'Klow Stack',
    shortName: 'Klow Stack',
    category: 'stacks',
    dosage: '80MG',
    subtitle: 'BPC-157 + TB-500 + GHK-KPV',
    summary: 'An advanced anti-inflammatory and recovery-oriented stack combining BPC-157, TB-500, and GHK-KPV for enhanced wellness and performance research.',
    researchFocus: ['Tissue repair', 'Gut health', 'Muscle recovery', 'Anti-inflammatory research'],
    composition: ['BPC-157', 'TB-500', 'GHK-KPV'],
    highlights: ['Stacked formulation', 'Research-first positioning', 'Anti-inflammatory focus'],
    accent: 'stardust',
    unitPriceCents: 14999,
    featured: true,
  },

  // ─── Metabolic / GLP-1 ───
  {
    slug: 'retatrutide',
    name: 'Retatrutide',
    shortName: 'Retatrutide',
    category: 'individual-peptides',
    dosage: '20MG / vial',
    subtitle: 'Triple receptor agonist',
    summary: 'A potent triple-receptor agonist (GLP-1, GIP, GCGR) for advanced metabolic-regulation and appetite-suppression research.',
    researchFocus: ['Triple receptor agonist', 'Metabolic regulation', 'Appetite suppression'],
    composition: ['Retatrutide'],
    highlights: ['Single-compound format', 'Triple agonist profile', 'Metabolic research'],
    accent: 'horizon',
    unitPriceCents: 13999,
    featured: true,
  },
  {
    slug: 'tirzepatide',
    name: 'Tirzepatide',
    shortName: 'Tirzepatide',
    category: 'individual-peptides',
    dosage: '20MG / vial',
    subtitle: 'Dual GLP-1 and GIP receptor agonist',
    summary: 'A dual GLP-1 and GIP receptor agonist for advanced metabolic research and glucose-regulation studies.',
    researchFocus: ['Dual GLP-1 receptor activity', 'GIP receptor activity', 'Metabolic regulation'],
    composition: ['Tirzepatide'],
    highlights: ['Single-compound format', 'Dual agonist profile', 'Metabolic research'],
    accent: 'cosmos',
    unitPriceCents: 13999,
    featured: true,
  },

  // ─── Tissue Repair / Recovery ───
  {
    slug: 'bpc-157',
    name: 'BPC-157',
    shortName: 'BPC-157',
    category: 'individual-peptides',
    dosage: '10MG / vial',
    subtitle: 'Extensively researched recovery peptide',
    summary: 'Body Protection Compound-157 — one of the most extensively studied peptides for tissue repair, gut barrier function, and muscle recovery research.',
    researchFocus: ['Recovery research', 'Tissue support', 'Gut health', 'Muscle repair'],
    composition: ['BPC-157'],
    highlights: ['Most researched peptide', 'Core catalog SKU', 'Broad protocol versatility'],
    accent: 'supernova',
    unitPriceCents: 6499,
    featured: true,
  },
  {
    slug: 'tb-500',
    name: 'TB-500',
    shortName: 'TB-500',
    category: 'individual-peptides',
    dosage: '10MG / vial',
    subtitle: 'Recovery & flexibility peptide',
    summary: 'Thymosin Beta-4 (TB-500) — a naturally occurring peptide for tissue repair, flexibility support, and recovery-focused research protocols.',
    researchFocus: ['Recovery research', 'Flexibility support', 'Tissue repair'],
    composition: ['TB-500 (Thymosin Beta-4)'],
    highlights: ['Single-compound format', 'Recovery-focused', 'Complementary to BPC-157'],
    accent: 'stardust',
    unitPriceCents: 8499,
  },

  // ─── Growth Hormone ───
  {
    slug: 'ipamorelin',
    name: 'Ipamorelin',
    shortName: 'Ipamorelin',
    category: 'individual-peptides',
    dosage: '10MG / vial',
    subtitle: 'GH secretagogue',
    summary: 'A selective growth-hormone secretagogue for endocrine research focused on GH-release pathways without significant prolactin or cortisol elevation.',
    researchFocus: ['GH secretagogue', 'Growth hormone release', 'Endocrine research'],
    composition: ['Ipamorelin'],
    highlights: ['Single-compound format', 'GH pathway research', 'Selective mechanism'],
    accent: 'horizon',
    unitPriceCents: 5999,
  },
  {
    slug: 'cjc-1295-ipamorelin',
    name: 'CJC-1295 No DAC + Ipamorelin',
    shortName: 'CJC-1295+Ipa',
    category: 'stacks',
    dosage: '5MG + 5MG',
    subtitle: 'GH stack — most popular',
    summary: 'A dual-compound growth-hormone stack combining CJC-1295 (No DAC) GHRH analog with Ipamorelin GH secretagogue for comprehensive endocrine research.',
    researchFocus: ['GHRH pathway', 'GH secretagogue', 'Combined endocrine research'],
    composition: ['CJC-1295 No DAC', 'Ipamorelin'],
    highlights: ['Dual-compound stack', 'Most popular GH stack', 'Complementary mechanisms'],
    accent: 'cosmos',
    unitPriceCents: 5499,
  },
  {
    slug: 'sermorelin',
    name: 'Sermorelin',
    shortName: 'Sermorelin',
    category: 'individual-peptides',
    dosage: '10MG / vial',
    subtitle: 'GHRH analog',
    summary: 'A growth-hormone-releasing-hormone (GHRH) analog for endocrine and longevity research focused on the GH/IGF-1 axis.',
    researchFocus: ['GHRH analog', 'Growth hormone research', 'Longevity studies'],
    composition: ['Sermorelin'],
    highlights: ['Single-compound format', 'GHRH pathway', 'Longevity research focus'],
    accent: 'supernova',
    unitPriceCents: 8999,
  },
  {
    slug: 'tesamorelin',
    name: 'Tesamorelin',
    shortName: 'Tesamorelin',
    category: 'individual-peptides',
    dosage: '10MG / vial',
    subtitle: 'GHRH / body composition',
    summary: 'A potent GHRH analog with FDA research history, positioned for body-composition and metabolic study protocols.',
    researchFocus: ['GHRH analog', 'Body composition research', 'Metabolic study'],
    composition: ['Tesamorelin'],
    highlights: ['Single-compound format', 'Body composition focus', 'FDA-studied compound'],
    accent: 'stardust',
    unitPriceCents: 13999,
  },

  // ─── Longevity ───
  {
    slug: 'epitalon',
    name: 'Epitalon',
    shortName: 'Epitalon',
    category: 'individual-peptides',
    dosage: '50MG / vial',
    subtitle: 'Telomere / longevity peptide',
    summary: 'A tetrapeptide associated with telomere maintenance and pineal-gland function research, widely studied in cellular aging and longevity protocols.',
    researchFocus: ['Telomere research', 'Longevity studies', 'Cellular aging'],
    composition: ['Epitalon (Epithalon)'],
    highlights: ['Longevity research leader', 'Telomere-focused', 'High-concentration vial'],
    accent: 'cosmos',
    unitPriceCents: 11999,
  },
  {
    slug: 'mots-c',
    name: 'MOTS-c',
    shortName: 'MOTS-c',
    category: 'individual-peptides',
    dosage: '40MG / vial',
    subtitle: 'Mitochondrial longevity peptide',
    summary: 'A mitochondrial-derived peptide for research into metabolic flexibility, insulin sensitivity, and the mitochondrial pathways of longevity.',
    researchFocus: ['Mitochondrial function', 'Metabolic flexibility', 'Longevity research'],
    composition: ['MOTS-c'],
    highlights: ['Mitochondrial peptide', 'Metabolic research', 'Longevity pathway'],
    accent: 'horizon',
    unitPriceCents: 12999,
  },

  // ─── Wellness ───
  {
    slug: 'glutathione',
    name: 'Glutathione',
    shortName: 'Glutathione',
    category: 'individual-peptides',
    dosage: '1500MG',
    subtitle: 'Master antioxidant',
    summary: 'A high-concentration glutathione formulation for research into antioxidant pathways, oxidative stress, and detoxification mechanisms.',
    researchFocus: ['Antioxidant research', 'Oxidative stress', 'Detoxification pathways'],
    composition: ['Glutathione'],
    highlights: ['Master antioxidant', 'High concentration', 'Wellness research'],
    accent: 'stardust',
    unitPriceCents: 5499,
  },
  {
    slug: 'nad-plus',
    name: 'NAD+',
    shortName: 'NAD+',
    category: 'individual-peptides',
    dosage: '1000MG',
    subtitle: 'Cellular energy & longevity',
    summary: 'Nicotinamide Adenine Dinucleotide — a foundational coenzyme for research into cellular energy metabolism, sirtuin activation, and aging pathways.',
    researchFocus: ['Cellular energy', 'Sirtuin activation', 'Longevity research'],
    composition: ['NAD+ (Nicotinamide Adenine Dinucleotide)'],
    highlights: ['Cellular energy coenzyme', 'Sirtuin pathway', 'Anti-aging research'],
    accent: 'supernova',
    unitPriceCents: 9999,
  },
  {
    slug: 'vitamin-b12',
    name: 'Vitamin B12',
    shortName: 'B12',
    category: 'individual-peptides',
    dosage: '10ML',
    subtitle: 'Energy & neurological support',
    summary: 'A research-grade methylcobalamin (B12) formulation for energy metabolism, methylation pathways, and neurological research.',
    researchFocus: ['Energy metabolism', 'Neurological research', 'Methylation pathways'],
    composition: ['Vitamin B12 (Methylcobalamin)'],
    highlights: ['Research-grade formulation', 'Energy metabolism', 'Neurological focus'],
    accent: 'horizon',
    unitPriceCents: 4999,
  },

  // ─── Essentials ───
  {
    slug: 'bacteriostatic-water',
    name: 'Bacteriostatic Water',
    shortName: 'BAC Water',
    category: 'accessories',
    dosage: '10ML (x4 pack)',
    subtitle: 'Reconstitution solvent',
    summary: 'Sterile bacteriostatic water (0.9% benzyl alcohol) in a convenient 4-pack for peptide reconstitution and laboratory preparation.',
    researchFocus: ['Reconstitution', 'Lab preparation', 'Research essential'],
    composition: ['Bacteriostatic Water 0.9% Benzyl Alcohol'],
    highlights: ['4-pack bundle', 'Research essential', 'Lab prep support'],
    accent: 'cosmos',
    unitPriceCents: 1499,
  },
];

export const featuredProducts = products.filter((product) => product.featured);

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const groupedProducts = {
  stacks: products.filter((product) => product.category === 'stacks'),
  individualPeptides: products.filter((product) => product.category === 'individual-peptides'),
  accessories: products.filter((product) => product.category === 'accessories'),
};

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
