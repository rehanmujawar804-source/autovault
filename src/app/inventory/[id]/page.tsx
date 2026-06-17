export default function ProductDetailsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Product Details
      </h1>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-semibold mb-4">
          LED Headlight H7
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-gray-500">Brand</p>
            <p>Philips</p>
          </div>

          <div>
            <p className="text-gray-500">Category</p>
            <p>Lights</p>
          </div>

          <div>
            <p className="text-gray-500">Stock</p>
            <p>25</p>
          </div>

          <div>
            <p className="text-gray-500">Buy Price</p>
            <p>₹500</p>
          </div>

          <div>
            <p className="text-gray-500">Sell Price</p>
            <p>₹800</p>
          </div>

          <div>
            <p className="text-gray-500">
              Profit Per Unit
            </p>
            <p className="text-green-600">
              ₹300
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}