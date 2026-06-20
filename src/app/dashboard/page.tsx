"use client";
import StatCard from "@/components/StatCard";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaymentSplitChart from "@/components/PaymentSplitChart";
import RevenueProfitChart from "@/components/RevenueProfitChart";
export default function DashboardPage() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {role === "owner" && (
          <StatCard
            title="Today's Revenue"
            value="₹42,500"
            valueClassName="text-green-600"
          />
        )}
        {role === "owner" && (
          <StatCard
            title="Today's Profit"
            value="₹12,800"
            valueClassName="text-green-600"
          />
        )}
        {role === "owner" && (
          <StatCard
            title="Total Revenue"
            value="₹24,50,000"
            valueClassName="text-green-600"
          />
        )}

        {role === "owner" && (
          <StatCard
            title="Total Profit"
            value="₹7,80,000"
            valueClassName="text-emerald-600"
          />
        )}

        {role === "owner" && (
          <StatCard
            title="Inventory Value"
            value="₹4,50,000"
          />
        )}

        <StatCard title="Total Products" value="350" />

        <StatCard
          title="Low Stock Alerts"
          value="12"
          valueClassName="text-red-500"
        />

        <StatCard title="Total Customers" value="187" />

        {role === "owner" && (
          <StatCard
            title="Outstanding Debt"
            value="₹1,12,000"
            valueClassName="text-green-600"
          />
        )}

        <StatCard title="Today's Bills" value="23" />

        <StatCard title="Transactions" value="29" />
      </div>
      {/* Revenue Graph + Payment Split */}
      {role === "owner" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-5 h-80">
            <h2 className="text-xl font-semibold mb-4">
              Revenue & Profit Graph
            </h2>

            <div className="h-60 border rounded-lg flex items-center justify-center text-gray-400">
              <RevenueProfitChart />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 min-h-[420px]">
            <h2 className="text-xl font-semibold mb-4">
              Payment Split
            </h2>

            <>
              <PaymentSplitChart />

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Cash</span>
                  </div>
                  <span className="font-medium">₹18,000</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>UPI</span>
                  </div>
                  <span className="font-medium">₹20,500</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Card</span>
                  </div>
                  <span className="font-medium">₹4,000</span>
                </div>

              </div>
            </>
          </div>
        </div>
      )}

      {/* Top Products + High Debt Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Top Selling Products
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span>LED Headlight H7</span>
              <span>120 Sold</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Android Stereo</span>
              <span>85 Sold</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Rear Camera</span>
              <span>74 Sold</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span>Seat Cover Premium</span>
              <span>68 Sold</span>
            </div>
          </div>
        </div>
        {role === "owner" && (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-semibold mb-4">
              High Debt Customers
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span>Rahul Sharma</span>
                <span className="text-red-500">₹12,500</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Amit Patel</span>
                <span className="text-red-500">₹8,200</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span>Vikas Singh</span>
                <span className="text-red-500">₹6,700</span>
              </div>
            </div>
          </div>
        )}

      </div>
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          ⚠ Low Stock Alerts
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>Android Stereo</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
              8 Left
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>LED Fog Lamp</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
              5 Left
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Reverse Camera</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
              3 Left
            </span>
          </div>

        </div>
      </div>
      {role === "owner" && (

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            📈 Business Insights
          </h2>

          <div className="space-y-3">

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              Revenue is up 12% compared to yesterday.
            </div>

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              Android Stereo is the top-selling product this week.
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              12 products are running low on stock.
            </div>

            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              Rahul Sharma has the highest outstanding debt.
            </div>

          </div>
        </div>
      )}

      {/* Quick Actions + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/inventory"
              className="bg-slate-900 text-white rounded-lg p-3 text-center"
            >
              Add Product
            </Link>
            <Link
              href="/inventory"
              className="bg-slate-900 text-white rounded-lg p-3 text-center"
            >
              New Bill
            </Link>

            <Link
              href="/inventory"
              className="bg-slate-900 text-white rounded-lg p-3 text-center"
            >
              Add Customer
            </Link>

            <Link
              href="/inventory"
              className="bg-slate-900 text-white rounded-lg p-3 text-center"
            >
              Record Payment
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Recent Transactions
          </h2>

          <div className="space-y-3">
            <div className="border-b pb-2">
              Invoice #1001 - ₹2,500
            </div>

            <div className="border-b pb-2">
              Invoice #1002 - ₹4,200
            </div>

            <div className="border-b pb-2">
              Invoice #1003 - ₹1,850
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}