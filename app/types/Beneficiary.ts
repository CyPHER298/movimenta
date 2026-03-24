
export type BeneficiaryTypes = {
  name: string;
  birth: string;
  cpf: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  titularName: string;
  docs: File[];
  plan: string
  dependency: "titular" | "conjuge" | "filho" | "agregado";
};
