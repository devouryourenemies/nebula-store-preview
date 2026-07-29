import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyOwnerSession } from '@/lib/ops/auth';
import { listOrders, listInventory } from '@/lib/ops/commerce-store';
import Link from 'next/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function verifyAuth() {
  const store = await cookies();
  const token = store.get('nebula-admin-token')?.value;
  if (!token) redirect('/admin/login');
  try {
    await verifyOwnerSession(token);
  } catch {
    redirect('/admin/login');
  }
}

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function statusBadgeColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
    case 'processing':
      return 'bg-blue-900/50 text-blue-300 border-blue-700';
    case 'shipped':
      return 'bg-purple-900/50 text-purple-300 border-purple-700';
    case 'delivered':
      return 'bg-green-900/50 text-green-300 border-green-700';
    case 'cancelled':
      return 'bg-red-900/50 text-red-300 border-red-700';
    default:
      return 'bg-gray-800 text-gray-300 border-gray-600';
  }
}

export default async function AdminDashboardPage() {
  await verifyAuth();

  const [orders, inventory] = await Promise.all([listOrders(), listInventory()]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const recentOrders = orders.slice(0, 10);
  const lowStockItems = inventory.filter((i) => i.quantityOnHand < 10);
  const totalProducts = inventory.length;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#24007C]/40 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-[#E58AC3]">Nebula</span>{' '}
            <span className="text-gray-400">Admin</span>
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#24007C]/30 bg-[#24007C]/10 p-5">
            <p className="text-sm text-gray-400">Total Orders</p>
            <p className="mt-1 text-3xl font-bold text-white">{orders.length}</p>
          </div>
          <div className="rounded-lg border border-[#7E84E5]/30 bg-[#7E84E5]/10 p-5">
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="mt-1 text-3xl font-bold text-[#EEAD70]">{formatCents(totalRevenue)}</p>
          </div>
          <div className="rounded-lg border border-[#E58AC3]/30 bg-[#E58AC3]/10 p-5">
            <p className="text-sm text-gray-400">Products</p>
            <p className="mt-1 text-3xl font-bold text-white">{totalProducts}</p>
          </div>
          <div className="rounded-lg border border-[#EEAD70]/30 bg-[#EEAD70]/10 p-5">
            <p className="text-sm text-gray-400">
              Low Stock{' '}
              {lowStockItems.length > 0 && (
                <span className="ml-1 inline-flex items-center rounded-full bg-red-900/60 px-2 py-0.5 text-xs font-medium text-red-300">
                  {lowStockItems.length}
                </span>
              )}
            </p>
            <p className="mt-1 text-3xl font-bold text-white">{lowStockItems.length}</p>
          </div>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Recent orders */}
          <div className="rounded-lg border border-gray-800 bg-black/60 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm text-[#7E84E5] transition-colors hover:text-[#E58AC3]"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-3 font-medium">ID</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800/50 transition-colors hover:bg-white/[0.02]">
                        <td className="px-5 py-3 font-mono text-xs text-gray-400">
                          {order.id.slice(0, 12)}...
                        </td>
                        <td className="px-5 py-3 text-white">{order.customerName}</td>
                        <td className="px-5 py-3 text-[#EEAD70]">{formatCents(order.totalCents)}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block rounded border px-2.5 py-0.5 text-xs font-medium ${statusBadgeColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-400">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-lg border border-gray-800 bg-black/60">
            <div className="border-b border-gray-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Quick Links</h2>
            </div>
            <div className="space-y-1 p-4">
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-[#24007C]/20 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded bg-[#7E84E5]/20 text-[#7E84E5]">
                  📋
                </span>
                <span>
                  <span className="block font-medium">Orders</span>
                  <span className="text-xs text-gray-500">Manage and update orders</span>
                </span>
              </Link>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-[#24007C]/20 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded bg-[#EEAD70]/20 text-[#EEAD70]">
                  📦
                </span>
                <span>
                  <span className="block font-medium">Inventory</span>
                  <span className="text-xs text-gray-500">Stock levels and adjustments</span>
                </span>
              </Link>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-300 transition-colors hover:bg-[#24007C]/20 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded bg-[#E58AC3]/20 text-[#E58AC3]">
                  🏷️
                </span>
                <span>
                  <span className="block font-medium">Products</span>
                  <span className="text-xs text-gray-500">View product catalog</span>
                </span>
              </Link>
            </div>

            {/* Low stock alert */}
            {lowStockItems.length > 0 && (
              <div className="border-t border-gray-800 px-5 py-4">
                <h3 className="mb-2 text-sm font-medium text-red-400">
                  ⚠ Low Stock Alerts
                </h3>
                <ul className="space-y-1">
                  {lowStockItems.slice(0, 5).map((item) => (
                    <li key={item.slug} className="flex justify-between text-xs text-gray-400">
                      <span>{item.name}</span>
                      <span className="font-mono text-red-300">{item.quantityOnHand} left</span>
                    </li>
                  ))}
                  {lowStockItems.length > 5 && (
                    <li className="text-xs text-gray-500">
                      +{lowStockItems.length - 5} more items low in stock
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
