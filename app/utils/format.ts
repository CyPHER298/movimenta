export function parseText(text: string | undefined) {
  if (!text) return text;

  if (text.length > 16) {
    return text.substring(0, 16) + "...";
  }
  return text;
}

export const formatCPF = (value: string) => {
  value = value.replace(/\D/g, ""); // Remove tudo que não é número
  value = value.replace(/^(\d{3})(\d)/, "$1.$2");
  value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  value = value.replace(/\.(\d{3})(\d)/, ".$1-$2");
  return value.substring(0, 14); // Garante que não passe do limite
};

export const formatCEP = (value: string) => {
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  return value.substring(0, 9);
};
