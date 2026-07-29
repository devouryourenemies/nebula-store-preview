import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { complianceDisclaimer, products } from '../products';
import { listInventory, listOrders } from './commerce-store';

export type HermesOpsResponse = {
  content: string;
  usedKnowledge: {
    zeroLabsGuide: boolean;
    productCatalog: boolean;
    inventory: boolean;
    orders: boolean;
  };
  endpoint: string;
};

function readZeroLabsGuide() {
  try {
    return readFileSync(join(process.cwd(), 'docs', 'ZERO_LABS_GUIDE.txt'), 'utf8');
  } catch {
    return '';
  }
}

function matchingCatalogSummary(message: string) {
  const lower = message.toLowerCase();
  const matches = products.filter((product) => {
    return lower.includes(product.name.toLowerCase()) || lower.includes(product.slug.toLowerCase());
  });
  const selected = matches.length > 0 ? matches : products.slice(0, 5);

  return selected
    .map((product) => `${product.name}: ${product.subtitle}. Research focus: ${product.researchFocus.join(', ')}.`)
    .join('\n');
}

export async function routeHermesOpsMessage(message: string): Promise<HermesOpsResponse> {
  const zeroLabsGuide = readZeroLabsGuide();
  const inventory = await listInventory();
  const orders = await listOrders();
  const lower = message.toLowerCase();
  const mentionsReconstitution = /reconstitut|bac water|bacteriostatic|mix/i.test(message);
  const catalogSummary = matchingCatalogSummary(message);

  const content = [
    'Nebula Ops assistant response:',
    catalogSummary,
    mentionsReconstitution
      ? 'For reconstitution questions, keep guidance framed as client ops and research-support language. Do not provide human dosing or use instructions.'
      : 'Keep all customer-facing language research-only and compliant.',
    `Compliance: ${complianceDisclaimer}`,
    zeroLabsGuide
      ? `Zero Labs guide loaded (${zeroLabsGuide.length} characters) for fulfillment, protocol, and support context.`
      : 'Zero Labs guide not found on disk yet.',
    `Inventory records available: ${inventory.length}. Orders available: ${orders.length}.`,
  ].join('\n');

  return {
    content,
    endpoint: process.env.HERMES_ROUTER_ENDPOINT || 'mock://hermes-router',
    usedKnowledge: {
      zeroLabsGuide: zeroLabsGuide.length > 0,
      productCatalog: true,
      inventory: true,
      orders: true,
    },
  };
}
