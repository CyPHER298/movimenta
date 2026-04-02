"use client";

import { Input } from "@/app/components/ui/Input/Input";
import { Label } from "@/app/components/ui/Label/Label";
import { CustomSelect } from "@/app/components/ui/Select/Select";
import { BeneficiaryTypes } from "@/app/types/BeneficiaryTypes";
import { formatCEP, formatCPF } from "@/app/utils/format";
import { Paperclip, Upload } from "lucide-react";
import { useState } from "react";

interface BeneficiaryProps {
  data: BeneficiaryTypes;
  onChange: (updatedData: BeneficiaryTypes) => void;
  onVinculoChange?: (file: File | null) => void;
  onPessoaisChange?: (files: File[]) => void;
}

export default function Beneficiary({ data, onChange, onVinculoChange, onPessoaisChange }: BeneficiaryProps) {
  const [dependencySelected, setDependencySelected] = useState(
    "Selecione a dependência",
  );
  const [ movementTypeSelected, setMovementTypeSelected] = useState("Seleciona a movimentação");
  const [vinculoName, setVinculoName] = useState<string | null>(null);
  const [pessoaisNames, setPessoaisNames] = useState<string[]>([]);

  const dependencies = [
    {
      label: "Titular",
      value: "TITULAR",
    },
    {
      label: "Cônjuge",
      value: "CONJUGE",
    },
    {
      label: "Filho",
      value: "FILLHO",
    },
    {
      label: "Agregado",
      value: "AGREGADO",
    },
  ];

    const movements = [
    {
      label: "Inclusão",
      value: "INCLUSAO",
    },
    {
      label: "Exclusão",
      value: "EXCLUSAO",
    },
    {
      label: "Alteração Cadastral",
      value: "ALTERACAO_DE_DADOS_CADASTRAIS",
    },
    {
      label: "2° Via da Carteirinha",
      value: "SEGUNDA_VIA_CARTEIRINHA",
    },
  ];

  const handleChange = (field: keyof BeneficiaryTypes, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-2 md:gap-2 md:grid lg:grid-cols-3 xl:grid-cols-4 ">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="name-benf">Nome Beneficiário</Label>
        <Input
          value={data.nome}
          onChange={(e) => handleChange("nome", e.target.value)}
          placeholder="Ex: Maria da Silva"
          type="text"
          id="name-benf"
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="move-type">Tipo de Movimentação</Label>
        <CustomSelect id="move-type" label={movementTypeSelected} onChange={(e) => {handleChange("tipoMovimentacao", e); setMovementTypeSelected(e)}} options={movements} value={movementTypeSelected}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="dt-nasc">Data de Nascimento</Label>
        <Input
          value={data.dataNascimento}
          onChange={(e) => handleChange("dataNascimento", e.target.value)}
          type="date"
          id="dt-nasc"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf-benef">CPF</Label>
        <Input
          value={formatCPF(data.cpf)}
          onChange={(e) => handleChange("cpf", e.target.value)}
          placeholder="Ex: 000.000.000-00"
          type="text"
          id="cpf-benef"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cep-benef">CEP</Label>
        <Input
          value={formatCEP(data.endereco.cep)}
          onChange={(e) => handleChange("endereco", { ...data.endereco, cep: e.target.value })}
          placeholder="Ex: 00000-000"
          type="text"
          id="cep-benef"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state-benef">Estado</Label>
        <Input
          value={data.endereco.estado}
          onChange={(e) => handleChange("endereco", { ...data.endereco, estado: e.target.value})}
          placeholder="Ex: São Paulo"
          type="text"
          id="state-benef"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city-benef">Cidade</Label>
        <Input
          value={data.endereco.cidade}
          onChange={(e) => handleChange("endereco", { ...data.endereco, cidade: e.target.value})}
          placeholder="Ex: São Paulo"
          type="text"
          id="city-benef"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nghood-benef">Bairro</Label>
        <Input
          value={data.endereco.bairro}
          onChange={(e) => handleChange("endereco", { ...data.endereco, bairro: e.target.value})}
          placeholder="Ex: Jardins"
          type="text"
          id="nghood-benef"
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor="street-benef">Logradouro</Label>
        <Input
          value={data.endereco.logradouro}
          onChange={(e) => handleChange("endereco", { ...data.endereco, logradouro: e.target.value})}
          placeholder="Ex: Av. Paulista"
          type="text"
          id="street-benef"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number-house">Número</Label>
        <Input
          value={data.endereco.numero}
          onChange={(e) => handleChange("endereco", { ...data.endereco, numero: e.target.value})}
          placeholder="Ex: 1439"
          type="text"
          id="number-house"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="compl-house">Complemento</Label>
        <Input
          value={data.endereco.complemento}
          onChange={(e) => handleChange("endereco", { ...data.endereco, complemento: e.target.value})}
          placeholder="Ex: Apto. 13"
          type="text"
          id="compl-house"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="select-dep">Dependência</Label>
        <CustomSelect
          id="select-dep"
          label={dependencySelected}
          onChange={(e) => {
            setDependencySelected(e);
            handleChange("dependencia", e);
          }}
          options={dependencies}
          value={data.dependencia}
        />
      </div>
      <div className={`space-y-2 ${data.dependencia === "TITULAR" ? "hidden" : ""}`}>
        <Label htmlFor="name-titular">Nome Titular</Label>
        <Input
          value={data.nomeTitular}
          onChange={(e) => handleChange("nomeTitular", e.target.value)}
          placeholder="Ex: Josué da Silva"
          type="text"
          id="name-titular"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan">Plano</Label>
        <Input
          value={data.planoAtual}
          onChange={(e) => handleChange("planoAtual", e.target.value)}
          placeholder="Ex: SMART 600 QP"
          type="string"
          id="plan"
        />
      </div>
      <div className="space-y-2 col-span-2">
        <Label htmlFor={`obs-benef-${data.cpf}`}>Observação</Label>
        <Input
          value={data.observacao}
          onChange={(e) => handleChange("observacao", e.target.value)}
          placeholder="Alguma observação sobre o beneficiário..."
          type="text"
          id={`obs-benef-${data.cpf}`}
        />
      </div>
      {/* Documento Pessoal */}
      <div className="space-y-2">
        <Label htmlFor={`pessoais-${data.cpf}`}>Documento Pessoal</Label>
        <label
          htmlFor={`pessoais-${data.cpf}`}
          className="flex items-center gap-2 w-full border border-gray-200 shadow-sm rounded-xl px-4 py-2 bg-white hover:bg-gray-50 cursor-pointer transition-all text-sm text-gray-500 truncate"
        >
          <Paperclip className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">
            {pessoaisNames.length > 0
              ? pessoaisNames.join(", ")
              : "Selecionar arquivo(s)..."}
          </span>
        </label>
        <input
          id={`pessoais-${data.cpf}`}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            setPessoaisNames(files.map((f) => f.name));
            onPessoaisChange?.(files);
          }}
        />
      </div>

      {/* Vínculo Empregatício */}
      <div className="space-y-2">
        <Label htmlFor={`vinculo-${data.cpf}`}>Vínculo Empregatício</Label>
        <label
          htmlFor={`vinculo-${data.cpf}`}
          className="flex items-center gap-2 w-full border border-gray-200 shadow-sm rounded-xl px-4 py-2 bg-white hover:bg-gray-50 cursor-pointer transition-all text-sm text-gray-500 truncate"
        >
          <Upload className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">
            {vinculoName ?? "Selecionar arquivo..."}
          </span>
        </label>
        <input
          id={`vinculo-${data.cpf}`}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setVinculoName(file?.name ?? null);
            onVinculoChange?.(file);
          }}
        />
      </div>
    </div>
  );
}
