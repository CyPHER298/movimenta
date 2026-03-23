import { File, Plus, Users, X } from "lucide-react";
import { CustomSelect } from "@/app/components/ui/Select/Select";
import { Input } from "@/app/components/ui/Input/Input";
import { useState } from "react";
import Beneficiary from "@/app/components/Beneficiary/Beneficiary";
import { Label } from "../ui/Label/Label";

export default function NewMovementCard({ onClick }: { onClick: () => void}) {
  const [movementSelect, setMovementSelect] = useState("");
  const [companySelect, setCompanySelect] = useState("");

  const options = [
    {
      label: "MONSTER",
      value: "Gorila",
    },
    {
      label: "ATTACK",
      value: "123",
    },
  ];

  const companies = [
    {
      label: "W3G",
      value: "w3g",
    },
    {
      label: "Casa das Alianças",
      value: "casa_das_aliancas",
    },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-xs fixed flex items-center justify-center inset-0 z-50 h-screen p-16">
      <div className="bg-white rounded-lg min-w-3/4">
        <div className="flex p-6 border-b border-black/20 justify-between items-center">
          <h2 className="font-bold text-2xl">Nova Movimentação</h2>
          <button type="button" onClick={onClick}>
            <X />
          </button>
        </div>
        <form className="p-[14px] gap-16 space-y-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="grid gap-2">
              <Label htmlFor="mvm-btn">Tipo de Movimentação</Label>
              <CustomSelect
                id="mvm-btn"
                label={movementSelect}
                onChange={setMovementSelect}
                options={options}
                value={movementSelect}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name-company">Empresa</Label>
              <CustomSelect
                id="name-company"
                label={companySelect}
                onChange={setCompanySelect}
                options={companies}
                value={companySelect}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="obs">Descritivo/Observação</Label>
              <Input
                id="obs"
                type="text"
                placeholder="Digite aqui sua observação..."
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="font-bold flex gap-2">
              <Users className="text-(--blue-icon)" />
              Beneficiários ({1})
            </h2>
            <div className="flex gap-2">
              <label className="flex gap-2 text-sm p-2 rounded border border-gray-200 shadow-md/20 hover:bg-(--branco) active:inset-shadow-sm/20 active:shadow-none cursor-pointer transition-all duration-50">
                <File />
                <p>Importar Planilha</p>
              </label>
              <button
                type="button"
                className="flex p-2 gap-2 text-sm rounded border border-gray-200 shadow-md/20 hover:bg-(--branco) active:inset-shadow-sm/20 active:shadow-none cursor-pointer transition-all duration-100"
              >
                <Plus />
                <p>Adicionar Beneficiario</p>
              </button>
            </div>
          </div>
          <div className="space-y-4 rounded-lg border border-gray-200 p-4 inset-shadow-sm/20">
            <h2 className="font-bold">Beneficiário 1</h2>
            <Beneficiary />
          </div>
        </form>
      </div>
    </div>
  );
}
