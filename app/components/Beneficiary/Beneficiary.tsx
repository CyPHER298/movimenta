"use client";

import { Input } from "@/app/components/ui/Input/Input";
import { Label } from "@/app/components/ui/Label/Label";
import { CustomSelect } from "@/app/components/ui/Select/Select";
import { useState } from "react";

export default function Beneficiary() {
  const [dependencySelected, setDependencySelected] = useState("");
  const dependencies = [
    {
      label: "Titular",
      value: "titular",
    },
    {
      label: "Cônjuge",
      value: "conjuge",
    },
    {
      label: "Filho",
      value: "filho",
    },
    {
      label: "Agregado",
      value: "agregado",
    },
  ];

  return (
    <div className="grid grid-cols-4 space-x-6 space-y-2">
      <div className="space-y-2">
        <Label htmlFor="name-benf">Nome Beneficiário</Label>
        <Input type="text" id="name-benf" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dt-nasc">Data de Nascimento</Label>
        <Input type="date" id="dt-nasc" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cpf-benef">CPF</Label>
        <Input type="text" id="cpf-benef" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cep-benef">CEP</Label>
        <Input type="text" id="cep-benef" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state-benef">Estado</Label>
        <Input type="text" id="state-benef" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city-benef">Cidade</Label>
        <Input type="text" id="city-benef" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nghood-benef">Bairro</Label>
        <Input type="text" id="nbhood-benef" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="street-benef">Logradouro</Label>
        <Input type="text" id="street-benef" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number-house">Número</Label>
        <Input type="text" id="number-house" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="compl-house">Complemento</Label>
        <Input type="text" id="compl-house" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="select-dep">Dependencia</Label>
        <CustomSelect
          id="select-dep"
          label={dependencySelected}
          onChange={setDependencySelected}
          options={dependencies}
          value={dependencySelected}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name-titular">Nome Titular</Label>
        <Input type="text" id="name-titular" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vinc-empreg">Vínculo Empregatício</Label>
        <Input type="file" id="vinc-empreg" />
      </div>
    </div>
  );
}
