"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Receipt,
  Users,
  BarChart3,
  Car,
  Settings,
} from "lucide-react";
import { FileText } from "lucide-react";

export default function Sidebar() {
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");

    if (savedRole) {
      setRole(savedRole);
    }
  }, []);
  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-5 border-r border-slate-800">
      <h1 className="text-2xl font-bold mb-10 text-amber-400">        AutoVault
      </h1>

      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/inventory"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
        >
          <Package size={20} />
          Inventory
        </Link>

        <Link
          href="/billing"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
        >
          <Receipt size={20} />
          Billing
        </Link>
        <Link
          href="/invoices"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <FileText size={20} />
          Invoices
        </Link>

        <Link
          href="/customers"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
        >
          <Users size={20} />
          Customers
        </Link>

        {role === "owner" && (
          <Link
            href="/analytics"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
          >
            <BarChart3 size={20} />
            Analytics
          </Link>
        )}

        <Link
          href="/vehicle-fitment"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
        >
          <Car size={20} />
          Vehicle Fitment
        </Link>

        {role === "owner" && (
          <Link
            href="/settings"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-all duration-200"
          >
            <Settings size={20} />
            Settings
          </Link>
        )}
        <button
          onClick={() => {
            localStorage.removeItem("role");
            router.push("/login");
          }}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-900 text-red-400 transition-all duration-200 mt-4"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}