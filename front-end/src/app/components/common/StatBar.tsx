import React from "react";
import { Activity, Network, Blocks, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "@/app/api/node";
import StatCard from "@/app/components/common/StatCard";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import ErrorMessage from "@/app/components/common/ErrorMessage";

const StatsBar = () => {
  const {
    data: nodeStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["node-status"],
    queryFn: nodeApi.getStatus,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={(error as Error).message} />;

  const stats = [
    {
      title: "Latest Block",
      value: nodeStatus?.blocks,
      icon: <Blocks className="w-6 h-6" />,
    },
    {
      title: "Network",
      value: nodeStatus?.chain,
      icon: <Network className="w-6 h-6" />,
    },
    {
      title: "Connections",
      value: nodeStatus?.connections,
      icon: <Activity className="w-6 h-6" />,
    },
    {
      title: "Difficulty",
      value: nodeStatus?.difficulty,
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

export default StatsBar;
