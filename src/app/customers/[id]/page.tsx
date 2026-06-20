export default function CustomerDetailsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Customer Details
            </h1>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">

                <h2 className="text-xl font-semibold">
                    Rahul Sharma
                </h2>

                <p className="text-gray-500">
                    9876543210
                </p>

                <p className="mt-4 text-orange-600 font-bold">
                    Outstanding Debt: ₹12,500
                </p>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

                <div className="bg-white rounded-xl border p-5">
                    <h3 className="text-gray-500">Total Spent</h3>
                    <p className="text-2xl font-bold">₹84,000</p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <h3 className="text-gray-500">Total Visits</h3>
                    <p className="text-2xl font-bold">18</p>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <h3 className="text-gray-500">Outstanding Debt</h3>
                    <p className="text-2xl font-bold text-orange-600">
                        ₹12,500
                    </p>
                    <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
                        Record Payment
                    </button>
                </div>

                <div className="bg-white rounded-xl border p-5">
                    <h3 className="text-gray-500">Last Visit</h3>
                    <p className="text-2xl font-bold">
                        12 Jun
                    </p>
                </div>

            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

                <h2 className="text-xl font-semibold mb-4">
                    Notes
                </h2>

                <p className="text-gray-600">
                    Prefers premium audio systems and usually pays via UPI.
                </p>

            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

                <h2 className="text-xl font-semibold mb-4">
                    Purchase History
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
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

                <h2 className="text-xl font-semibold mb-4">
                    Purchased Products
                </h2>

                <div className="flex flex-wrap gap-2">

                    <span className="bg-slate-100 px-3 py-2 rounded-lg">
                        LED Headlight
                    </span>

                    <span className="bg-slate-100 px-3 py-2 rounded-lg">
                        Android Stereo
                    </span>

                    <span className="bg-slate-100 px-3 py-2 rounded-lg">
                        Reverse Camera
                    </span>

                </div>

            </div>
        </div>
    );
}