import { Users } from "lucide-react";
import Link from "next/link";

interface TeamCardProps {
  nome: string;
  id: string;
  analistas: string[];
}

export const TeamCard = ({ nome, id, analistas }: TeamCardProps) => {
  return (
    <Link
      href={`/teams/${id}`}
      className="space-y-4 items-center px-4 py-2 h-full bg-white border-(--blue-icon)
      p-4 rounded-lg shadow-lg hover:border-r-4 transition-all duration-100"
    >
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">{nome}</h2>
        <span className="font-bold text-xl flex gap-2">
          {analistas.length} <Users />
        </span>
      </div>
      <div>
        <p className="font-semibold text-(--cinza)">Analistas:</p>
        <ul className="list-disc pl-5">
          {analistas && analistas.length > 0 ? (
            analistas.map((analista) => (
              <div key={analista} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-(--azul)" />
                <span>{analista}</span>
              </div>
            ))
          ) : (
            <li className="opacity-60">Não há analistas</li>
          )}
        </ul>
      </div>
    </Link>
  );
};
