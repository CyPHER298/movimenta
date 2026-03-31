import { BeneficiaryMovimentsTypes } from "@/app/types/BeneficiaryMovimentsTypes";
import { BeneficiaryTypes } from "@/app/types/BeneficiaryTypes";
import { MovementTypes } from "@/app/types/MovementTypes";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  LucideIcon,
  RefreshCw,
  Search,
  UserMinus,
  UserPlus,
} from "lucide-react";

interface MovementProps {
  id: string;
  nome: string;
  tipoMovimentacao: string;
  status: string;
}

interface tipoConfigProps {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
}

interface statusConfigProps {
  label: string;
  icon: LucideIcon;
  className: string;
}



const statusConfig: Record<MovementProps["status"], statusConfigProps> = {
  pendente: {
    label: "Pendente",
    icon: Clock,
    className: "text-orange-600",
  },
  em_analise: {
    label: "Em Análise",
    icon: Search,
    className: "text-blue-600",
  },
  concluido: {
    label: "Concluído",
    icon: CheckCircle2,
    className: "text-green-600",
  },
};

export const MovementChildrenCard = ({
  nome,
  tipoMovimentacao,
  status
}: MovementProps) => {
  // const statusInfo = statusConfig[status];
  // const StatusIcon = statusInfo.icon;

  return (
    <></>
  );
};
