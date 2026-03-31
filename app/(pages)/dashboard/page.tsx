"use client";

import { MovementChildrenCard } from "@/app/components/MovementCard/MovementChildCard";
import { MovementTypes } from "@/app/types/MovementTypes";
import { Clock, Files, Layers, Plus, Search } from "lucide-react";
import StatCard from "@/app/components/StatCard/StatCard";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import NewMovementCard from "@/app/components/NewMovementCard/NewMovementCard";
import { verifyConnected } from "@/app/utils/verifyConnected";
import { MovementParentCard } from "@/app/components/MovementCard/MovementParentCard";

export default function Page() {
  const stats = [
    { label: "Total", value: 0, icon: Files, color: "gray-icon" },
    { label: "Pendentes", value: 0, icon: Layers, color: "orange-icon" },
    { label: "Em Análise", value: 0, icon: Clock, color: "blue-icon" },
    { label: "Concluídos", value: 0, icon: Files, color: "green-icon" },
  ];
  const [movements, setMovements] = useState<MovementTypes[]>([]);
  const [toggleNewMovement, setToggleNewMovement] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [companies, setCompanies] = useState<
    { label: string; value: string }[]
  >([]);

  const filteredMovements = useMemo(() => {
    const q = search.toLowerCase();
    return movements.filter(
      (m) =>
        m.nomeEmpresa.toLowerCase().includes(q) ||
        m.beneficiariosMovimentacao.some((b) =>
          b.nome.toLowerCase().includes(q),
        ),
    );
  }, [movements, search]);

  async function getCompanies() {
    try {
      const res = await api.get("/empresas");
      setCompanies(
        res.data.map((company: any) => ({
          label: company.nome,
          value: company.idEmpresa,
        })),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function getMoviments() {
    try {
      const res = await api.get("/movimentacao");
      setMovements(res.data || []);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    verifyConnected(window.location.href);
    getMoviments();
    getCompanies();
  }, []);

  return (
    <>
      {toggleNewMovement && (
        <NewMovementCard
          companies={companies}
          onClick={() => setToggleNewMovement(false)}
        />
      )}
      <div className="space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Olá, (Cliente)</h1>
          <h2 className="opacity-60">
            Gerencie as movimentações do seu plano de saúde
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
        <div className="flex justify-between items-center p-2 w-full">
          <h2 className="text-2xl font-semibold tracking-wide ">
            Movimentações
          </h2>
          <button
            onClick={() => setToggleNewMovement(true)}
            className="flex gap-2 bg-(--blue-button) p-2 text-white cursor-pointer rounded-lg hover:bg-(--azul) active:scale-95 transition duration-100"
          >
            <Plus className="scale-70" />
            <p className="hidden lg:block">Nova Movimentação</p>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por empresa ou beneficiário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm outline-none focus:border-(--blue-icon) focus:ring-2 focus:ring-(--blue-icon)/20 transition"
          />
        </div>
        {filteredMovements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMovements.map((movement, i) => (
              <MovementParentCard
                key={i}
                dataMovimentacao={movement.dataMovimentacao}
                id={movement.idMovimentacao}
                nomeEmpresa={movement.nomeEmpresa}
                observacao={movement.observacao}
                modalidade={movement.modalidade}
                beneficiarios={movement.beneficiariosMovimentacao}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-2xl italic opacity-60">
            {search ? "Nenhuma movimentação encontrada" : "Não há movimentações realizadas"}
          </p>
        )}
      </div>
    </>
  );
}
