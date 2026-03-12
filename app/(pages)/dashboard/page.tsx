"use client";

import { Clock, Files, Layers } from "lucide-react";

export default function Page() {
  const stats = [
    { label: "Total", value: 0, icon: Files, color: "gray" },
    { label: "Pendentes", value: 0, icon: Layers, color: "orange" },
    { label: "Em Análise", value: 0, icon: Clock, color: "blue" },
    { label: "Concluídos", value: 0, icon: Files, color: "green" },
  ];

  return (
    <div className="p-4 justify-center">
      <div>
        <h1 className="text-3xl font-bold">Olá, (Cliente)</h1>
        <h2 className="opacity-60">
          Gerencie as movimentações do seu plano de saúde
        </h2>
      </div>
      <div>
        {stats.map((stat, i) => (
          // Criar um componente para os stats
          <div></div>
        ))}
      </div>
    </div>
  );
}
