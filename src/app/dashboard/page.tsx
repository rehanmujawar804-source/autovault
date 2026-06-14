import StatCard from "@/components/StatCard";
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Revenue" value="₹42,500" valueClassName="text-green-600" />

        <StatCard title="Today's Profit" value="₹12,800" valueClassName="text-emerald-600" />

        <StatCard title="Total Products" value="350" />

        <StatCard
          title="Low Stock Alerts"
          value="12"
          valueClassName="text-red-500"
        />

        <StatCard title="Total Customers" value="187" />

        <StatCard
          title="Outstanding Debt"
          value="₹58,000"
          valueClassName="text-orange-600"
        />

        <StatCard title="Today's Bills" value="23" />

        <StatCard title="Transactions" value="29" />
      </div>
      {/* Revenue Graph + Payment Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5 h-80">
          <h2 className="text-xl font-semibold mb-4">
            Revenue & Profit Graph
          </h2>

          <div className="h-60 border rounded-lg flex items-center justify-center text-gray-400">
            Graph Coming Soon
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 h-80">
          <h2 className="text-xl font-semibold mb-4">
            Payment Split
          </h2>

          <div className="space-y-4">
            <div>Cash - ₹18,000</div>
            <div>UPI - ₹20,500</div>
            <div>Card - ₹4,000</div>
          </div>
        </div>
      </div>

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
      </div>

      {/* Quick Actions + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-slate-900 text-white rounded-lg p-3">
              Add Product
            </button>

            <button className="bg-slate-900 text-white rounded-lg p-3">
              New Bill
            </button>

            <button className="bg-slate-900 text-white rounded-lg p-3">
              Add Customer
            </button>

            <button className="bg-slate-900 text-white rounded-lg p-3">
              Record Payment
            </button>
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