"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/app/components/ui/Input/Input";
import { CustomSelect } from "@/app/components/ui/Select/Select";
import { api } from "@/services/api";
import { TeamsTypes } from "@/app/types/TeamsTypes";
import { CompanyTypes } from "@/app/types/CompanyTypes";
import { formatCNPJ } from "@/app/utils/format";

interface AddCompanyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormState {
  nome: string;
  cnpj: string;
  modalidade: "" | "SAUDE" | "DENTAL";
  operadora: string;
  idEquipeResponsavel: string;
  qtdVidas: string;
  coligada: boolean;
  idEmpresaMae: string;
}

const INITIAL_FORM: FormState = {
  nome: "",
  cnpj: "",
  modalidade: "",
  operadora: "",
  idEquipeResponsavel: "",
  qtdVidas: "",
  coligada: false,
  idEmpresaMae: "",
};

export function AddCompanyModal({ onClose, onSuccess }: AddCompanyModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [teams, setTeams] = useState<TeamsTypes[]>([]);
  const [companies, setCompanies] = useState<CompanyTypes[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/equipes").then((res) => setTeams(res.data)).catch(() => setTeams([]));
    api.get("/empresas").then((res) => setCompanies(res.data)).catch(() => setCompanies([]));
  }, []);

  function handleChange(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.nome || !form.cnpj || !form.modalidade || !form.operadora) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/empresas", {
        nome: form.nome,
        cnpj: form.cnpj.replace(/\D/g, ""),
        modalidade: form.modalidade,
        operadora: form.operadora,
        idEquipeResponsavel: form.idEquipeResponsavel || undefined,
        qtdVidas: Number(form.qtdVidas) || 0,
        coligada: form.coligada,
        idEmpresaMae: form.coligada ? form.idEmpresaMae || undefined : undefined,
      });
      onSuccess();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao cadastrar empresa. Tente novamente.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-screen bg-black/40 p-4">
      <div className="w-1/2 rounded-2xl bg-white shadow-xl flex flex-col p-3">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold">Adicionar empresa</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 p-3 overflow-y-auto">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="nome">
              Nome <span className="text-red-500">*</span>
            </label>
            <Input
              id="nome"
              type="text"
              placeholder="Nome da empresa"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="cnpj">
              CNPJ <span className="text-red-500">*</span>
            </label>
            <Input
              id="cnpj"
              type="text"
              placeholder="00.000.000/0000-00"
              value={form.cnpj}
              onChange={(e) => handleChange("cnpj", formatCNPJ(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Modalidade <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                id="modalidade"
                label="Selecione"
                value={form.modalidade}
                onChange={(value) =>
                  handleChange("modalidade", value as "" | "SAUDE" | "DENTAL")
                }
                options={[
                  { label: "Saúde", value: "SAUDE" },
                  { label: "Dental", value: "DENTAL" },
                ]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Operadora <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                id="operadora"
                label="Selecione"
                value={form.operadora}
                onChange={(value) => handleChange("operadora", value)}
                options={[
                  { label: "Amil", value: "AMIL" },
                  { label: "Bradesco", value: "BRADESCO" },
                  { label: "GNDI", value: "GNDI" },
                  { label: "Hapvida", value: "HAPVIDA" },
                  { label: "CNU", value: "CNU" },
                  { label: "Unimed", value: "UNIMED" },
                  { label: "SulAmérica", value: "SULAMERICA" },
                  { label: "Santa Helena", value: "SANTA_HELENA" },
                  { label: "Sulmed", value: "SULMED" },
                  { label: "Unihosp", value: "UNIHOSP" },
                  { label: "Interodonto", value: "INTERODONTO" },
                  { label: "Trasmontano", value: "TRASMONTANO" },
                  { label: "Porto Seguro", value: "PORTO_SEGURO" },
                  { label: "Plena", value: "PLENA" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Equipe responsável</label>
              <CustomSelect
                id="equipe"
                label="Selecione"
                value={form.idEquipeResponsavel}
                onChange={(value) => handleChange("idEquipeResponsavel", value)}
                options={teams.map((t) => ({ label: t.nome, value: t.id }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="vidas">
                Qtd. de vidas
              </label>
              <Input
                id="vidas"
                type="number"
                placeholder="0"
                value={form.qtdVidas}
                onChange={(e) => handleChange("qtdVidas", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={form.coligada}
              onClick={() => handleChange("coligada", !form.coligada)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                form.coligada ? "bg-(--azul)" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  form.coligada ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <label className="text-sm font-medium cursor-pointer" onClick={() => handleChange("coligada", !form.coligada)}>
              Empresa coligada
            </label>
          </div>

          {form.coligada && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Empresa mãe</label>
              <CustomSelect
                id="empresaMae"
                label="Selecione a empresa mãe"
                value={form.idEmpresaMae}
                onChange={(value) => handleChange("idEmpresaMae", value)}
                options={companies.map((c) => ({ label: c.nome, value: c.idEmpresa }))}
              />
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-(--azul) px-4 py-2 text-sm font-medium text-white hover:bg-(--blue-icon) transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
