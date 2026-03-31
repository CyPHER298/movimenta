import { BeneficiaryTypes } from "@/app/types/BeneficiaryTypes";
import { BeneficiaryMovimentsTypes } from "./BeneficiaryMovimentsTypes";

export type MovementTypes = {
  idMovimentacao: string;
  nomeEmpresa: string;
  beneficiariosMovimentacao: BeneficiaryMovimentsTypes[]
}

