type StatCardProps = {
  title: string;
  value: string;
  valueClassName?: string;
};

export default function StatCard({
  title,
  value,
  valueClassName = "",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg transition-all duration-200">
      <h3 className="text-gray-500">{title}</h3>

      <p className={`text-2xl font-bold ${valueClassName}`}>
        {value}
      </p>
   
    </div>
  );
}