"use client";

import { useState } from "react";
import { fitments } from "@/data/fitments";

export default function VehicleFitmentPage() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] =
    useState("");
  const [selectedModel, setSelectedModel] =
    useState("");
  const [selectedYear, setSelectedYear] =
    useState("");
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Vehicle Fitment
      </h1>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">

        <select
          value={selectedBrand}
          onChange={(e) =>
            setSelectedBrand(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            All Brands
          </option>

          {[...new Set(
            fitments.map((item) => item.brand)
          )].map((brand) => (
            <option
              key={brand}
              value={brand}
            >
              {brand}
            </option>
          ))}
        </select>


      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">

        <select
          value={selectedModel}
          onChange={(e) =>
            setSelectedModel(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            All Models
          </option>

          {[...new Set(
            fitments
              .filter(
                (item) =>
                  selectedBrand === "" ||
                  item.brand === selectedBrand
              )
              .map((item) => item.model)
          )].map((model) => (
            <option
              key={model}
              value={model}
            >
              {model}
            </option>
          ))}
        </select>

      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value)
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="">
            All Years
          </option>

          {[...new Set(
            fitments
              .filter(
                (item) =>
                  (selectedBrand === "" ||
                    item.brand === selectedBrand) &&
                  (selectedModel === "" ||
                    item.model === selectedModel)
              )
              .map((item) => item.year)
          )].map((year) => (
            <option
              key={year}
              value={year}
            >
              {year}
            </option>
          ))}
        </select>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">

          <input
            type="text"
            placeholder="Search brand, model or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

        </div>

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">
                Brand
              </th>

              <th className="p-4 text-left">
                Model
              </th>

              <th className="p-4 text-left">
                Year
              </th>

              <th className="p-4 text-left">
                Compatible Products
              </th>
            </tr>
          </thead>

          <tbody>
            {fitments
              .filter((fitment) => {
                const matchesSearch =
                  fitment.brand
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  fitment.model
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  fitment.year.includes(search);

                const matchesBrand =
                  selectedBrand === "" ||
                  fitment.brand === selectedBrand;
                const matchesModel =
                  selectedModel === "" ||
                  fitment.model === selectedModel;
                const matchesYear =
                  selectedYear === "" ||
                  fitment.year === selectedYear;

                return (
                  matchesSearch &&
                  matchesBrand &&
                  matchesModel &&
                  matchesYear
                );
              })
              .map((fitment) => (
                <tr
                  key={fitment.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {fitment.brand}
                  </td>

                  <td className="p-4">
                    {fitment.model}
                  </td>

                  <td className="p-4">
                    {fitment.year}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">

                      {fitment.products.map(
                        (product, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 px-3 py-1 rounded-full text-sm"
                          >
                            {product}
                          </span>
                        )
                      )}

                    </div>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
        {selectedBrand &&
          selectedModel &&
          selectedYear && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-6">

              <h2 className="text-xl font-semibold mb-4">
                Compatible Products
              </h2>

              {fitments
                .filter(
                  (fitment) =>
                    fitment.brand === selectedBrand &&
                    fitment.model === selectedModel &&
                    fitment.year === selectedYear
                )
                .map((fitment) => (
                  <div
                    key={fitment.id}
                    className="flex flex-wrap gap-2"
                  >
                    {fitment.products.map(
                      (product, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-700 px-3 py-2 rounded-lg"
                        >
                          {product}
                        </span>
                      )
                    )}
                  </div>
                ))}

            </div>
          )}



      </div>
    </div>
  );
}