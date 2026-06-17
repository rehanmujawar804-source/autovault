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
        </div>
    );
}