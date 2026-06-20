import { customers } from "@/data/customers";
import Link from "next/link";

export default function CustomersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Customers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold">187</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-gray-500">
            High Debt Customers
          </h3>

          <p className="text-2xl font-bold text-red-600">
            12
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-gray-500">Outstanding Debt</h3>
          <p className="text-2xl font-bold text-orange-600">
            ₹58,000
          </p>
        </div>
      </div>
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
        ⚠ 12 customers have outstanding debt above ₹5,000
      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-3 justify-between">

          <input
            type="text"
            placeholder="Search customer..."
            className="border rounded-lg px-4 py-2 w-full md:w-80"
          />

          <div className="flex gap-2 flex-wrap">
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              All
            </button>

            <button className="bg-white border px-4 py-2 rounded-lg">
              High Debt
            </button>

            <button className="bg-white border px-4 py-2 rounded-lg">
              Partial Debt
            </button>

            <button className="bg-white border px-4 py-2 rounded-lg">
              No Debt
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Debt</th>

              <th className="p-4 text-left">Total Spent</th>
              <th className="p-4 text-left">Visits</th>
              <th className="p-4 text-left">Last Visit</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t"
              >
                <td className="p-4">
                  {customer.name}
                </td>

                <td className="p-4">
                  {customer.phone}
                </td>

                <td
                  className={`p-4 font-semibold ${customer.debt > 0
                    ? "text-orange-600"
                    : "text-green-600"
                    }`}
                >
                  ₹{customer.debt}
                </td>
                <td className="p-4">₹84,000</td>
                <td className="p-4">18</td>
                <td className="p-4">12 Jun 2026</td>

                <td className="p-4">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="bg-slate-900 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}