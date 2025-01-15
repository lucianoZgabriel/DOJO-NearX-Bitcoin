"use client";

import MineBlocks from "@/app/components/blocks/MineBlocks";

export default function Mine() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Bitcoin Block Mining
      </h1>
      <MineBlocks />
    </div>
  );
}
