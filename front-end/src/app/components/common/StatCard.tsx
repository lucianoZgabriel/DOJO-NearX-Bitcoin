import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  icon?: ReactNode;
}

const formatValue = (val: string | number | undefined): string => {
  if (val === undefined || val === null) return "---";

  if (typeof val === "number") {
    if (val > 1e9) return `${(val / 1e9).toFixed(2)}B`;
    if (val > 1e6) return `${(val / 1e6).toFixed(2)}M`;
    if (val > 1e3) return `${(val / 1e3).toFixed(2)}K`;

    if (val.toString().includes(".")) {
      return val.toFixed(2);
    }

    return val.toLocaleString();
  }

  return val.toString();
};

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-xl font-semibold text-white mt-1 truncate">
            {formatValue(value)}
          </p>
        </div>
        {icon && (
          <div className="text-neonGreen flex-shrink-0 ml-4">{icon}</div>
        )}
      </div>
    </div>
  );
}
