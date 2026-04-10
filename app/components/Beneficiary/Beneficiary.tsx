"use client";

import { Input } from "@/app/components/ui/Input/Input";
import { Label } from "@/app/components/ui/Label/Label";
import { CustomSelect } from "@/app/components/ui/Select/Select";
import { BeneficiaryTypes } from "@/app/types/BeneficiaryTypes";
import { formatCEP, formatCPF, onlyDigits } from "@/app/utils/format";
import { Loader2, Paperclip, Upload } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface BeneficiaryProps {
  data: BeneficiaryTypes;
  onChange: (updatedData: BeneficiaryTypes) => void;
  onVinculoChange?: (file: File | null) => void;
  onPessoaisChange?: (files: File[]) => void;
  idEmpresa?: string;
  fieldErrors?: Record<string, string>;
}

const dependencies = [
  { label: "Titular", value: "TITULAR" },
  { label: "Cônjuge", value: "CONJUGE" },
  { label: "Filho", value: "FILHO" },
  { label: "Agregado", value: "AGREGADO" },
];

const movements = [
  { label: "Inclusão", value: "INCLUSAO" },
  { label: "Exclusão", value: "EXCLUSAO" },
  { label: "Alteração Cadastral", value: "ALTERACAO_DE_DADOS_CADASTRAIS" },
  { label: "2ª Via da Carteirinha", value: "SEGUNDA_VIA_DE_CARTEIRINHA" },
];

const fadeSlide = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18 },
};

export default function Beneficiary({
  data,
  onChange,
  onVinculoChange,
  onPessoaisChange,
  fieldErrors = {},
}: BeneficiaryProps) {
  const fe = (key: string) => fieldErrors[key];
  const [vinculoName, setVinculoName] = useState<string | null>(null);
  const [pessoaisNames, setPessoaisNames] = useState<string[]>([]);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [alterarEndereco, setAlterarEndereco] = useState(false);

  const tipo = data.tipoMovimentacao;

  const handleChange = (field: keyof BeneficiaryTypes, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleCepChange = async (raw: string) => {
    handleChange("endereco", { ...data.endereco, cep: raw });
    const digits = onlyDigits(raw);
    if (digits.length !== 8) return;
    setIsFetchingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const json = await res.json();
      if (json.erro) return;
      onChange({
        ...data,
        endereco: {
          ...data.endereco,
          cep: raw,
          logradouro: json.logradouro ?? data.endereco.logradouro,
          bairro: json.bairro ?? data.endereco.bairro,
          cidade: json.localidade ?? data.endereco.cidade,
          estado: json.estado ?? data.endereco.estado,
          complemento: json.complemento ?? data.endereco.complemento,
        },
      });
    } catch {
      // silencioso — usuário pode preencher manualmente
    } finally {
      setIsFetchingCep(false);
    }
  };


  // ─── Shared field blocks ────────────────────────────────────────────────────

  const fieldNome = (
    <div className="space-y-1 col-span-2">
      <Label htmlFor={`nome-${data.cpf}`}>Nome Beneficiário</Label>
      <Input
        value={data.nome}
        onChange={(e) => handleChange("nome", e.target.value)}
        placeholder="Ex: Maria da Silva"
        type="text"
        id={`nome-${data.cpf}`}
        error={!!fe("nome")}
      />
      {fe("nome") && <p className="text-xs text-red-500">{fe("nome")}</p>}
    </div>
  );

  const fieldCpf = (
    <div className="space-y-1">
      <Label htmlFor={`cpf-${data.cpf}`}>CPF</Label>
      <Input
        value={formatCPF(data.cpf)}
        onChange={(e) => handleChange("cpf", e.target.value)}
        placeholder="000.000.000-00"
        type="text"
        id={`cpf-${data.cpf}`}
        error={!!fe("cpf")}
      />
      {fe("cpf") && <p className="text-xs text-red-500">{fe("cpf")}</p>}
    </div>
  );

  const fieldObs = (
    <div className="space-y-1 col-span-2">
      <Label htmlFor={`obs-${data.cpf}`}>Observação</Label>
      <Input
        value={data.observacao}
        onChange={(e) => handleChange("observacao", e.target.value)}
        placeholder="Alguma observação sobre o beneficiário..."
        type="text"
        id={`obs-${data.cpf}`}
      />
    </div>
  );

  const fieldDocPessoal = (
    <div className="space-y-2">
      <Label htmlFor={`pessoais-${data.cpf}`}>Documento Pessoal</Label>
      <label
        htmlFor={`pessoais-${data.cpf}`}
        className="flex items-center gap-2 w-full border border-gray-200 shadow-sm rounded-xl px-4 py-2 bg-white hover:bg-gray-50 cursor-pointer transition-all text-sm text-gray-500 truncate"
      >
        <Paperclip className="h-4 w-4 shrink-0 text-gray-400" />
        <span className="truncate">
          {pessoaisNames.length > 0 ? pessoaisNames.join(", ") : "Selecionar arquivo(s)..."}
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
  );

  const fieldVinculo = (label: string) => (
    <div className="space-y-2">
      <Label htmlFor={`vinculo-${data.cpf}`}>{label}</Label>
      <label
        htmlFor={`vinculo-${data.cpf}`}
        className="flex items-center gap-2 w-full border border-gray-200 shadow-sm rounded-xl px-4 py-2 bg-white hover:bg-gray-50 cursor-pointer transition-all text-sm text-gray-500 truncate"
      >
        <Upload className="h-4 w-4 shrink-0 text-gray-400" />
        <span className="truncate">{vinculoName ?? "Selecionar arquivo..."}</span>
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
  );

  const fullAddressAndDetails = (
    <>
      <div className="space-y-1">
        <Label htmlFor={`dt-nasc-${data.cpf}`}>Data de Nascimento</Label>
        <Input
          value={data.dataNascimento}
          onChange={(e) => handleChange("dataNascimento", e.target.value)}
          type="date"
          id={`dt-nasc-${data.cpf}`}
          error={!!fe("dataNascimento")}
        />
        {fe("dataNascimento") && <p className="text-xs text-red-500">{fe("dataNascimento")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`cep-${data.cpf}`}>CEP</Label>
        <div className="relative">
          <Input
            value={formatCEP(data.endereco.cep)}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="00000-000"
            type="text"
            id={`cep-${data.cpf}`}
            error={!!fe("cep")}
          />
          {isFetchingCep && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400 pointer-events-none" />
          )}
        </div>
        {fe("cep") && <p className="text-xs text-red-500">{fe("cep")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`estado-${data.cpf}`}>Estado</Label>
        <Input
          value={data.endereco.estado}
          onChange={(e) => handleChange("endereco", { ...data.endereco, estado: e.target.value })}
          placeholder="Ex: São Paulo"
          type="text"
          id={`estado-${data.cpf}`}
          error={!!fe("estado")}
        />
        {fe("estado") && <p className="text-xs text-red-500">{fe("estado")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`cidade-${data.cpf}`}>Cidade</Label>
        <Input
          value={data.endereco.cidade}
          onChange={(e) => handleChange("endereco", { ...data.endereco, cidade: e.target.value })}
          placeholder="Ex: São Paulo"
          type="text"
          id={`cidade-${data.cpf}`}
          error={!!fe("cidade")}
        />
        {fe("cidade") && <p className="text-xs text-red-500">{fe("cidade")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`bairro-${data.cpf}`}>Bairro</Label>
        <Input
          value={data.endereco.bairro}
          onChange={(e) => handleChange("endereco", { ...data.endereco, bairro: e.target.value })}
          placeholder="Ex: Jardins"
          type="text"
          id={`bairro-${data.cpf}`}
          error={!!fe("bairro")}
        />
        {fe("bairro") && <p className="text-xs text-red-500">{fe("bairro")}</p>}
      </div>
      <div className="space-y-1 col-span-2">
        <Label htmlFor={`logradouro-${data.cpf}`}>Logradouro</Label>
        <Input
          value={data.endereco.logradouro}
          onChange={(e) => handleChange("endereco", { ...data.endereco, logradouro: e.target.value })}
          placeholder="Ex: Av. Paulista"
          type="text"
          id={`logradouro-${data.cpf}`}
          error={!!fe("logradouro")}
        />
        {fe("logradouro") && <p className="text-xs text-red-500">{fe("logradouro")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`numero-${data.cpf}`}>Número</Label>
        <Input
          value={data.endereco.numero}
          onChange={(e) => handleChange("endereco", { ...data.endereco, numero: e.target.value })}
          placeholder="Ex: 1439"
          type="text"
          id={`numero-${data.cpf}`}
          error={!!fe("numero")}
        />
        {fe("numero") && <p className="text-xs text-red-500">{fe("numero")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`compl-${data.cpf}`}>Complemento</Label>
        <Input
          value={data.endereco.complemento}
          onChange={(e) => handleChange("endereco", { ...data.endereco, complemento: e.target.value })}
          placeholder="Ex: Apto. 13"
          type="text"
          id={`compl-${data.cpf}`}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`dep-${data.cpf}`}>Dependência</Label>
        <CustomSelect
          id={`dep-${data.cpf}`}
          label="Selecione a dependência"
          onChange={(e) => handleChange("dependencia", e)}
          options={dependencies}
          value={data.dependencia}
        />
      </div>
      <div className={`space-y-1 ${data.dependencia === "TITULAR" ? "hidden" : ""}`}>
        <Label htmlFor={`titular-${data.cpf}`}>Nome Titular</Label>
        <Input
          value={data.nomeTitular}
          onChange={(e) => handleChange("nomeTitular", e.target.value)}
          placeholder="Ex: Josué da Silva"
          type="text"
          id={`titular-${data.cpf}`}
          error={!!fe("nomeTitular")}
        />
        {fe("nomeTitular") && <p className="text-xs text-red-500">{fe("nomeTitular")}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor={`plano-${data.cpf}`}>Plano</Label>
        <Input
          value={data.planoAtual}
          onChange={(e) => handleChange("planoAtual", e.target.value)}
          placeholder="Ex: SMART 600 QP"
          type="text"
          id={`plano-${data.cpf}`}
          error={!!fe("planoAtual")}
        />
        {fe("planoAtual") && <p className="text-xs text-red-500">{fe("planoAtual")}</p>}
      </div>
      {fieldObs}
      {fieldDocPessoal}
      {fieldVinculo("Vínculo Empregatício")}
    </>
  );

  // ─── Section selector ───────────────────────────────────────────────────────

  const renderSection = () => {
    // SEGUNDA_VIA: CPF + nome + obs
    if (tipo === "SEGUNDA_VIA_DE_CARTEIRINHA") {
      return (
        <motion.div key="segunda-via" {...fadeSlide} className="contents">
          {fieldNome}
          {fieldCpf}
          {fieldObs}
        </motion.div>
      );
    }

    // EXCLUSAO: nome + CPF + comprovante de desligamento + obs
    if (tipo === "EXCLUSAO") {
      return (
        <motion.div key="exclusao" {...fadeSlide} className="contents">
          {fieldNome}
          {fieldCpf}
          {fieldVinculo("Comprovante de Desligamento")}
          {fieldObs}
        </motion.div>
      );
    }

    // ALTERACAO: formulário direto
    if (tipo === "ALTERACAO_DE_DADOS_CADASTRAIS") {
      return (
        <motion.div key="alteracao" {...fadeSlide} className="contents">
          {/* Nome */}
          {fieldNome}

          {/* CPF */}
          {fieldCpf}

          {/* Documento pessoal */}
          {fieldDocPessoal}

          {/* Dependência + titular */}
          <div className="space-y-2">
            <Label htmlFor={`dep-${data.cpf}`}>Dependência</Label>
            <CustomSelect
              id={`dep-${data.cpf}`}
              label="Selecione a dependência"
              onChange={(e) => handleChange("dependencia", e)}
              options={dependencies}
              value={data.dependencia}
            />
          </div>
          <div className={`space-y-2 ${data.dependencia === "TITULAR" ? "hidden" : ""}`}>
            <Label htmlFor={`titular-${data.cpf}`}>Nome Titular</Label>
            <Input
              value={data.nomeTitular}
              onChange={(e) => handleChange("nomeTitular", e.target.value)}
              placeholder="Ex: Josué da Silva"
              type="text"
              id={`titular-${data.cpf}`}
            />
          </div>

              {/* Toggle endereço */}
              <div className="col-span-full flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={alterarEndereco}
                  onClick={() => setAlterarEndereco((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                    alterarEndereco ? "bg-(--azul)" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      alterarEndereco ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className="text-sm font-medium cursor-pointer"
                  onClick={() => setAlterarEndereco((v) => !v)}
                >
                  Alterar endereço
                </span>
              </div>

              {alterarEndereco && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor={`cep-${data.cpf}`}>CEP</Label>
                    <div className="relative">
                      <Input
                        value={formatCEP(data.endereco.cep)}
                        onChange={(e) => handleCepChange(e.target.value)}
                        placeholder="00000-000"
                        type="text"
                        id={`cep-${data.cpf}`}
                      />
                      {isFetchingCep && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400 pointer-events-none" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`estado-${data.cpf}`}>Estado</Label>
                    <Input
                      value={data.endereco.estado}
                      onChange={(e) => handleChange("endereco", { ...data.endereco, estado: e.target.value })}
                      placeholder="Ex: São Paulo"
                      type="text"
                      id={`estado-${data.cpf}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`cidade-${data.cpf}`}>Cidade</Label>
                    <Input
                      value={data.endereco.cidade}
                      onChange={(e) => handleChange("endereco", { ...data.endereco, cidade: e.target.value })}
                      placeholder="Ex: São Paulo"
                      type="text"
                      id={`cidade-${data.cpf}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`bairro-${data.cpf}`}>Bairro</Label>
                    <Input
                      value={data.endereco.bairro}
                      onChange={(e) => handleChange("endereco", { ...data.endereco, bairro: e.target.value })}
                      placeholder="Ex: Jardins"
                      type="text"
                      id={`bairro-${data.cpf}`}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor={`logradouro-${data.cpf}`}>Logradouro</Label>
                    <Input
                      value={data.endereco.logradouro}
                      onChange={(e) => handleChange("endereco", { ...data.endereco, logradouro: e.target.value })}
                      placeholder="Ex: Av. Paulista"
                      type="text"
                      id={`logradouro-${data.cpf}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`numero-${data.cpf}`}>Número</Label>
                    <Input
                      value={data.endereco.numero}
                      onChange={(e) => handleChange("endereco", { ...data.endereco, numero: e.target.value })}
                      placeholder="Ex: 1439"
                      type="text"
                      id={`numero-${data.cpf}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`compl-${data.cpf}`}>Complemento</Label>
                    <Input
                      value={data.endereco.complemento}
                      onChange={(e) => handleChange("endereco", { ...data.endereco, complemento: e.target.value })}
                      placeholder="Ex: Apto. 13"
                      type="text"
                      id={`compl-${data.cpf}`}
                    />
                  </div>
                </>
              )}

          {/* Observação */}
          {fieldObs}
        </motion.div>
      );
    }

    // INCLUSAO (padrão): formulário completo
    return (
      <motion.div key="inclusao" {...fadeSlide} className="contents">
        {fieldNome}
        {fieldCpf}
        {fullAddressAndDetails}
      </motion.div>
    );
  };

  return (
    <div className="space-y-2 md:gap-2 md:grid lg:grid-cols-3 xl:grid-cols-4">
      {/* Tipo sempre visível no topo */}
      <div className="space-y-2 col-span-2">
        <Label htmlFor={`tipo-${data.cpf}`}>Tipo de Movimentação</Label>
        <CustomSelect
          id={`tipo-${data.cpf}`}
          label="Selecione a movimentação"
          onChange={(value) => handleChange("tipoMovimentacao", value)}
          options={movements}
          value={data.tipoMovimentacao}
        />
      </div>

      <AnimatePresence mode="wait">
        {renderSection()}
      </AnimatePresence>
    </div>
  );
}
