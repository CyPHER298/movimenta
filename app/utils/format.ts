export function parseText(text: string | undefined) {
  if (!text) return text;

  if (text.length > 16) {
    return text.substring(0, 16) + "...";
  }
  return text;
}

export function parseCnpj(cnpj: string | undefined) {
  if (!cnpj) return cnpj;

  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14) {
    return cnpj;
  }

  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
}
