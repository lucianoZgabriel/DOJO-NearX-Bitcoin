"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number | undefined;
  icon?: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  const formatValue = (val: string | number | undefined) => {
    if (val === undefined || val === null) return "---";

    if (typeof val === "number") {
      if (val > 1e5) {
        try {
          return val.toExponential(2);
        } catch (e) {
          console.error(e);
          return val.toString();
        }
      }
      return val.toLocaleString();
    }

    return val;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">
            {formatValue(value)}
          </p>
        </div>
        {icon && <div className="text-neonGreen">{icon}</div>}
      </div>
    </div>
  );
}
