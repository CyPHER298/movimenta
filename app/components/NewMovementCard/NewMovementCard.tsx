import { CheckCircle2, Plus, Users, X, AlertCircle } from "lucide-react";
import { CustomSelect } from "@/app/components/ui/Select/Select";
import { Input } from "@/app/components/ui/Input/Input";
import { useState } from "react";
import Beneficiary from "@/app/components/Beneficiary/Beneficiary";
import { Label } from "../ui/Label/Label";
import { BeneficiaryTypes } from "@/app/types/BeneficiaryTypes";
import { api } from "@/services/api";
import SendMovement from "@/services/sendMovement";
import { onlyDigits } from "@/app/utils/format";

interface NewMovementProps {
  companies: { label: string; value: string }[];
  onClick: () => void;
  onSuccess?: () => void;
  defaultCompany?: string;
}

export default function NewMovementCard({
  onClick,
  companies,
  onSuccess,
  defaultCompany,
}: NewMovementProps) {
  const [companySelect, setCompanySelect] = useState(defaultCompany ?? "Seleciona a empresa");
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryTypes[]>([]);
  const [beneficiaryFiles, setBeneficiaryFiles] = useState<
    { vinculo: File | null; pessoais: File[] }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [beneficiaryErrors, setBeneficiaryErrors] = useState<Record<number, Record<string, string>>>({});

  const addBenef = () => {
    const newBenef: BeneficiaryTypes = {
      nome: "",
      dataNascimento: "",
      cpf: "",
      endereco: {
        logradouro: "",
        numero: "0",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        complemento: "",
      },
      dependencia: "TITULAR",
      dadosComplementares: {
        documentosBeneficiario: [],
        documentosEmpresa: [],
      },
      nomeTitular: "",
      planoAtual: "",
      observacao: "",
      tipoMovimentacao: "INCLUSAO",
      status: "PENDENTE",
    };

    setBeneficiaries([...beneficiaries, newBenef]);
    setBeneficiaryFiles([...beneficiaryFiles, { vinculo: null, pessoais: [] }]);
  };

  const deleteBenef = (index: number) => {
    setBeneficiaries(beneficiaries.filter((_, i) => i !== index));
    setBeneficiaryFiles(beneficiaryFiles.filter((_, i) => i !== index));
  };

  const updateBenef = (index: number, updatedData: BeneficiaryTypes) => {
    const newBenef = [...beneficiaries];
    newBenef[index] = updatedData;
    setBeneficiaries(newBenef);
    if (beneficiaryErrors[index]) {
      setBeneficiaryErrors((prev) => { const next = { ...prev }; delete next[index]; return next; });
    }
  };

  const updateBenefFiles = (
    index: number,
    field: "vinculo" | "pessoais",
    value: File | null | File[],
  ) => {
    const updated = [...beneficiaryFiles];
    updated[index] = { ...updated[index], [field]: value };
    setBeneficiaryFiles(updated);
  };

  const validateBeneficiaries = (): Record<number, Record<string, string>> | null => {
    const allErrors: Record<number, Record<string, string>> = {};

    for (let i = 0; i < beneficiaries.length; i++) {
      const b = beneficiaries[i];
      const tipo = b.tipoMovimentacao;
      const errs: Record<string, string> = {};

      const req = (key: string, value: string, label: string) => {
        if (!value?.trim()) errs[key] = `${label} é obrigatório.`;
      };

      req("nome", b.nome, "Nome");
      req("cpf", b.cpf, "CPF");

      if (tipo === "INCLUSAO") {
        req("dataNascimento", b.dataNascimento, "Data de Nascimento");
        req("cep", b.endereco.cep, "CEP");
        req("estado", b.endereco.estado, "Estado");
        req("cidade", b.endereco.cidade, "Cidade");
        req("bairro", b.endereco.bairro, "Bairro");
        req("logradouro", b.endereco.logradouro, "Logradouro");
        req("numero", b.endereco.numero, "Número");
        req("planoAtual", b.planoAtual, "Plano");
        if (b.dependencia !== "TITULAR") {
          req("nomeTitular", b.nomeTitular, "Nome do Titular");
        }
      }

      if (Object.keys(errs).length > 0) allErrors[i] = errs;
    }

    return Object.keys(allErrors).length > 0 ? allErrors : null;
  };

  const handleMovement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validações síncronas antes de qualquer operação async
    setError(null);

    if (!companySelect || companySelect === "Seleciona a empresa") {
      setError("Selecione uma empresa antes de enviar.");
      document.getElementById("new-movement-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (beneficiaries.length === 0) {
      setError("Adicione ao menos um beneficiário.");
      document.getElementById("new-movement-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const validationError = validateBeneficiaries();
    if (validationError) {
      setBeneficiaryErrors(validationError);
      const count = Object.values(validationError).reduce((acc, e) => acc + Object.keys(e).length, 0);
      setError(`Corrija ${count} campo(s) obrigatório(s) destacado(s) abaixo.`);
      document.getElementById("new-movement-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setBeneficiaryErrors({});

    setIsLoading(true);

    try {
      const fd = new FormData(event.currentTarget);
      const idEmpresa = companySelect;
      const descritivo = fd.get("obs") as string;
      const nomeEmpresa =
        companies.find((c) => c.value === companySelect)?.label ??
        companySelect;

      // Passo 1: upload dos arquivos de cada beneficiário
      const uploadedBeneficiaries = await Promise.all(
        beneficiaries.map(async (benef, index) => {
          const files = beneficiaryFiles[index] ?? {
            vinculo: null,
            pessoais: [],
          };
          const allFiles: File[] = [
            ...files.pessoais,
            ...(files.vinculo ? [files.vinculo] : []),
          ];

          if (allFiles.length === 0) {
            return {
              ...benef,
              dadosComplementares: {
                documentosBeneficiario: [],
                documentosEmpresa: [],
              },
            };
          }

          const uploadForm = new FormData();
          allFiles.forEach((file) => uploadForm.append("files", file));

          const params = new URLSearchParams({
            tipoMovimentacao: benef.tipoMovimentacao,
            nomeBeneficiario: benef.nome,
            nomeEmpresa,
          });

          const uploadRes = await api.post(
            `/api/files/upload?${params.toString()}`,
            uploadForm,
            { headers: { "Content-Type": "multipart/form-data" } },
          );

          const { paths: filePaths } = uploadRes.data as {
            message: string;
            paths: string[];
          };
          const pessoaisCount = files.pessoais.length;
          const documentosBeneficiario = filePaths.slice(0, pessoaisCount);
          const documentosEmpresa = files.vinculo ? [filePaths[pessoaisCount]] : [];

          return {
            ...benef,
            dadosComplementares: {
              documentosBeneficiario,
              documentosEmpresa,
            },
          };
        }),
      );

      // Passo 2: sanitizar CPF e CEP
      const sanitized = uploadedBeneficiaries.map((b) => ({
        ...b,
        cpf: onlyDigits(b.cpf),
        endereco: { ...b.endereco, cep: onlyDigits(b.endereco.cep) },
      }));

      await SendMovement(sanitized, idEmpresa, descritivo);

      setSuccess(true);
      setTimeout(() => {
        onClick();
        onSuccess?.();
      }, 1800);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Erro ao enviar a movimentação. Tente novamente.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="new-movement-scroll" className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-xs overflow-y-auto md:p-16">
      <div className="bg-(--bg-default) text-(--black) w-full rounded-lg border border-gray-300 shadow-lg">
        <div className="flex p-6 border-b border-black/20 justify-between items-center">
          <h2 className="font-bold text-2xl">Nova Movimentação</h2>
          <button type="button" onClick={onClick} className="cursor-pointer">
            <X />
          </button>
        </div>
        <form className="p-8 space-y-6" onSubmit={handleMovement}>
          <div className="grid gap-2 md:grid-cols-3 md:gap-8">
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              {defaultCompany ? (
                <div className="h-10 w-full border border-gray-200 shadow-sm rounded-xl flex items-center px-4 bg-gray-50 text-sm text-gray-600 cursor-not-allowed">
                  {companies.find((c) => c.value === defaultCompany)?.label ?? defaultCompany}
                </div>
              ) : (
                <CustomSelect
                  id="company"
                  label="Selecione a empresa"
                  onChange={setCompanySelect}
                  options={companies}
                  value={companySelect}
                />
              )}
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
          <div className="space-y-4 md:space-y-0 md:flex items-center justify-between">
            <h2 className="font-bold flex gap-2">
              <Users className="text-(--blue-icon)" />
              Beneficiários ({beneficiaries.length})
            </h2>
            <div className="md:flex gap-2 space-y-2 md:space-y-0">
              <button
                type="button"
                onClick={addBenef}
                className="flex w-full md:w-auto gap-2 bg-white text-sm p-2 rounded border border-gray-200 shadow-md/20 hover:bg-(--branco) active:inset-shadow-sm/20 active:shadow-none cursor-pointer transition-all duration-50"
              >
                <Plus />
                <p>Beneficiario</p>
              </button>
            </div>
          </div>
          {/* Banner de erro */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Banner de sucesso */}
          {success && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Movimentação enviada com sucesso! Redirecionando...
            </div>
          )}

          {beneficiaries.length > 0 && (
            <>
              {beneficiaries.map((benef, index) => (
                <div
                  key={index}
                  className="space-y-4 bg-white/60 rounded-lg border border-gray-300 p-4 inset-shadow-sm/20"
                >
                  <div className="font-bold flex justify-between">
                    <p>Beneficiário {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => deleteBenef(index)}
                      className="cursor-pointer"
                    >
                      <X />
                    </button>
                  </div>
                  <Beneficiary
                    key={`beneficiary-field-${index}`}
                    data={benef}
                    onChange={(updatedData) => updateBenef(index, updatedData)}
                    onVinculoChange={(file) =>
                      updateBenefFiles(index, "vinculo", file)
                    }
                    onPessoaisChange={(files) =>
                      updateBenefFiles(index, "pessoais", files)
                    }
                    fieldErrors={beneficiaryErrors[index]}
                  />
                </div>
              ))}
              <div className="space-y-2 md:space-y-0 md:flex gap-2 justify-end">
                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="bg-(--green-btn) border border-green-400 text-(--branco) text-lg px-4 py-2 rounded-md w-full md:w-36 hover:text-(--branco) transition-all duration-100 active:inset-shadow-green-900 active:inset-shadow-sm/60 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>
                <button
                  type="button"
                  onClick={onClick}
                  disabled={isLoading}
                  className="bg-(--red-btn) border border-red-200 text-(--branco) text-lg px-4 py-2 rounded-md w-full md:w-36 cursor-pointer hover:text-(--branco) active:inset-shadow-sm/60 active:inset-shadow-red-900 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
