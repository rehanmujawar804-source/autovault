"use client";

import { useState } from "react";
import { products } from "@/data/products";
export default function BillingPage() {
  const [cart, setCart] = useState<any[]>([]);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Billing
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">

          <input
            type="text"
            placeholder="Search Product..."
            className="w-full border p-3 rounded-lg mb-4"
          />

          <div className="space-y-3">

            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {product.name}
                  </p>

                  <p className="text-gray-500">
                    ₹{product.sellPrice}
                  </p>
                </div>

                <button
                  onClick={() => setCart([...cart, product])}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>
            ))}

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">

          <h2 className="text-xl font-semibold mb-4">
            Cart
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              No products added
            </p>
          ) : (
            <div className="space-y-3">

              {cart.map((item, index) => (
                <div
                  key={index}
                  className="border-b pb-2"
                >
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{item.sellPrice}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}