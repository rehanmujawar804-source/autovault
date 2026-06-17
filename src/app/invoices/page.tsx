import { invoices } from "@/data/invoices";

export default function InvoicesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Invoice History
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Payment</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Date</th>
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