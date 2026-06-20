"use client";
import StatCard from "@/components/StatCard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      window.location.href = "/login";
      return;
    }

    if (role !== "owner") {
      window.location.href = "/dashboard";
    }
  }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Revenue"
          value="₹2,45,000"
          valueClassName="text-green-600"
        />

        <StatCard
          title="Total Profit"
          value="₹78,000"
          valueClassName="text-emerald-600"
        />

        <StatCard
          title="Outstanding Debt"
          value="₹20,700"
          valueClassName="text-orange-600"
        />

        <StatCard
          title="Inventory Value"
          value="₹4,50,000"
        />

      </div>


      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

        <h2 className="text-xl font-semibold mb-4">
          Top Selling Products
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>LED Headlight H7</span>
            <span className="font-semibold">
              125 Sold
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Android Stereo</span>
            <span className="font-semibold">
              94 Sold
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Rear Camera</span>
            <span className="font-semibold">
              76 Sold
            </span>
          </div>

        </div>


      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Low Stock Products
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

        <h2 className="text-xl font-semibold mb-4">
          Recent Sales
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between border-b pb-2">
            <span>INV-1001 • Rahul Sharma</span>

            <span className="font-semibold text-green-600">
              ₹2,500
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>INV-1002 • Amit Patel</span>

            <span className="font-semibold text-green-600">
              ₹4,200
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>INV-1003 • Walk-in Customer</span>

            <span className="font-semibold text-green-600">
              ₹1,850
            </span>
          </div>

        </div>

      </div>
    </div>


  );
}