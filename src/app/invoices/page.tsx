import { invoices } from "@/data/invoices";

export default function InvoicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Invoice History
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-gray-500">Total Invoices</h3>
            <p className="text-2xl font-bold">125</p>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-gray-500">Paid</h3>
            <p className="text-2xl font-bold text-green-600">95</p>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-gray-500">Partial</h3>
            <p className="text-2xl font-bold text-orange-600">18</p>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <h3 className="text-gray-500">Debt</h3>
            <p className="text-2xl font-bold text-red-600">12</p>
          </div>

        </div>
        <div className="bg-white rounded-xl border p-4 mb-6 flex flex-col md:flex-row gap-3 justify-between">

          <input
            type="text"
            placeholder="Search invoice..."
            className="border rounded-lg px-4 py-2 w-full md:w-80"
          />

          <div className="flex gap-2 flex-wrap">

            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg">
              All
            </button>

            <button className="border px-4 py-2 rounded-lg">
              Paid
            </button>

            <button className="border px-4 py-2 rounded-lg">
              Partial
            </button>

            <button className="border px-4 py-2 rounded-lg">
              Debt
            </button>

          </div>

        </div>
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Payment Method</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-t"
              >
                <td className="p-4">
                  #{invoice.id}
                </td>

                <td className="p-4">
                  {invoice.customer}
                </td>

                <td className="p-4">
                  {invoice.paymentMethod}
                </td>

                <td className="p-4 font-semibold text-green-600">
                  ₹{invoice.total}
                </td>

                <td className="p-4">
                  {invoice.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}