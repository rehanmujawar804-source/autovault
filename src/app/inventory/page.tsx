import StatCard from "@/components/StatCard";
import Link from "next/link";
import { products } from "@/data/products";

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Inventory
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Products"
          value="350"
        />

        <StatCard
          title="Total Stock Units"
          value="2450"
        />

        <StatCard
          title="Inventory Value"
          value="₹4,50,000"
        />

        <StatCard
          title="Low Stock"
          value="12"
          valueClassName="text-red-500"
        />
      </div>
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search product..."
          className="border rounded-lg px-4 py-2 w-80"
        />

        <Link
          href="/inventory/add"
          className="bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </Link>
      </div>
      <div className="flex gap-3 mb-6 flex-wrap">
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">
          All
        </button>

        <button className="bg-white shadow px-4 py-2 rounded-lg">
          Lights
        </button>

        <button className="bg-white shadow px-4 py-2 rounded-lg">
          Electronics
        </button>

        <button className="bg-white shadow px-4 py-2 rounded-lg">
          Audio
        </button>

        <button className="bg-white shadow px-4 py-2 rounded-lg">
          Accessories
        </button>
      </div>
      <div className="   bg-white rounded-2xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr className="bg-slate-100">
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Brand</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Stock</th>
              <th className="p-4 font-semibold">Buy Price</th>
              <th className="p-4 font-semibold">Sell Price</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">

                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/inventory/${product.id}`}
                      className="font-medium hover:text-amber-500"
                    >
                      {product.name}
                    </Link>

                    {product.stock <= 10 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Low Stock
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4">{product.brand}</td>
                <td className="p-4">{product.category}</td>

                <td className="p-4">{product.stock}</td>

                <td className="p-4">₹{product.buyPrice}</td>

                <td className="p-4">₹{product.sellPrice}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded">
                      +
                    </button>

                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      -
                    </button>

                    <button className="bg-slate-900 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}