"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [shopName, setShopName] =
    useState("AutoVault");

  const [phone, setPhone] =
    useState("9876543210");

  const [address, setAddress] =
    useState("Mumbai");
  const [ownerName, setOwnerName] =
    useState("Owner Name");
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
        Settings
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">

        <div className="space-y-4">

          <div>
            <label className="block mb-2 font-medium">
              Shop Name
            </label>

            <input
              value={shopName}
              onChange={(e) =>
                setShopName(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Owner Name
            </label>

            <input
              value={ownerName}
              onChange={(e) =>
                setOwnerName(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Invoice Prefix
            </label>

            <input
              defaultValue="INV"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Currency Symbol
            </label>

            <input
              defaultValue="₹"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            className="bg-slate-900 text-white px-6 py-3 rounded-lg"
          >
            Save Settings
          </button>

        </div>

      </div>
    </div>
  );
}