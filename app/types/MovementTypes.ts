import { BeneficiaryMovimentsTypes } from "./BeneficiaryMovimentsTypes";

export type MovementTypes = {
  idMovimentacao: string;
  nomeEmpresa: string;
  beneficiariosMovimentacao: BeneficiaryMovimentsTypes[];
  dataMovimentacao: string | number[];
  observacao: string;
  modalidade: string
}

