"use client";
import { customers } from "@/data/customers";
import { useState } from "react";
import { products } from "@/data/products";
export default function BillingPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [invoiceNumber, setInvoiceNumber] =
    useState("");

  const [invoiceGenerated, setInvoiceGenerated] =
    useState(false);
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
                  onClick={() => {
                    const existingItem = cart.find(
                      (item) => item.id === product.id
                    );

                    if (existingItem) {
                      setCart(
                        cart.map((item) =>
                          item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                        )
                      );
                    } else {
                      setCart([
                        ...cart,
                        {
                          ...product,
                          quantity: 1,
                        },
                      ]);
                    }
                  }}
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
          <div className="mb-4 bg-slate-100 rounded-lg p-3">
            <p className="text-sm text-gray-500">
              Invoice Number
            </p>

            <p className="font-bold">
              {invoiceNumber}
            </p>
          </div>
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2">
              Customer
            </label>

            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">
                Walk-in Customer
              </option>

              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.name}
                >
                  {customer.name}
                </option>
              ))}
            </select>

          </div>
          <div className="mb-4">

            <label className="block text-sm font-medium mb-2">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>Credit</option>
            </select>

          </div>

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

                  <div className="flex items-center gap-2 mt-2">

                    <button
                      onClick={() => {
                        setCart(
                          cart
                            .map((cartItem) =>
                              cartItem.id === item.id
                                ? {
                                  ...cartItem,
                                  quantity: cartItem.quantity - 1,
                                }
                                : cartItem
                            )
                            .filter(
                              (cartItem) => cartItem.quantity > 0
                            )
                        );
                      }}
                      className="bg-red-500 text-white w-8 h-8 rounded"
                    >
                      -
                    </button>

                    <span className="font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => {
                        setCart(
                          cart.map((cartItem) =>
                            cartItem.id === item.id
                              ? {
                                ...cartItem,
                                quantity: cartItem.quantity + 1,
                              }
                              : cartItem
                          )
                        );
                      }}
                      className="bg-green-500 text-white w-8 h-8 rounded"
                    >
                      +
                    </button>

                  </div>

                  <p className="text-sm font-medium mt-2">
                    ₹{item.sellPrice * item.quantity}
                  </p>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between">
                  <span>Total</span>
                  <span>
                    ₹{cart.reduce(
                      (sum, item) =>
                        sum + item.sellPrice * item.quantity,
                      0
                    )}
                  </span>
                </div>
              </div>
              <div className="border-t mt-4 pt-4">
                <p className="text-lg font-bold">
                  Total: ₹
                  {cart.reduce(
                    (sum, item) =>
                      sum + item.sellPrice * item.quantity,
                    0
                  )}
                </p>
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      setInvoiceNumber(`INV-${Date.now()}`);
                      setInvoiceGenerated(true);
                    }}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Generate Invoice
                  </button>
                )}

              </div>
              {invoiceGenerated && (
                
                <div className="mt-6 border-t pt-4">

                  <h3 className="text-lg font-bold">
                    Invoice Generated
                  </h3>

                  <p className="text-gray-500">
                    Invoice No: {invoiceNumber}
                  </p>

                  <p className="text-gray-500">
                    Customer: {selectedCustomer || "Walk-in Customer"}
                  </p>
                  <div className="mt-4 space-y-2">

                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <span>
                          ₹{item.sellPrice * item.quantity}
                        </span>
                      </div>
                    ))}

                  </div>

                  <p className="font-bold mt-2">
                    Total: ₹
                    {cart.reduce(
                      (sum, item) =>
                        sum + item.sellPrice * item.quantity,
                      0
                    )}
                  </p>

                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}