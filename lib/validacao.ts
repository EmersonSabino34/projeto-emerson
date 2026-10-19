/**
 * Regras de validação dos formulários de conta: cadastro, login e o painel.
 * Ficam juntas para as três telas aceitarem e recusarem exatamente o mesmo.
 */

/** Propositalmente simples: barra erro de digitação óbvio sem rejeitar
    endereços válidos e incomuns. */
export function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export const SENHA_MINIMA = 6;

/** Telefone brasileiro: DDD + 8 ou 9 dígitos, com ou sem máscara. Vazio vale. */
export function telefoneValido(telefone: string) {
  const digitos = telefone.replace(/\D/g, "");
  return digitos.length === 0 || digitos.length === 10 || digitos.length === 11;
}

/** "11912345678" vira "(11) 91234-5678"; o que não for telefone volta igual. */
export function formatarTelefone(telefone: string) {
  const d = telefone.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** "AAAA-MM-DD" de hoje no fuso de quem usa (toISOString daria a data UTC). */
export function dataLocal(data = new Date()) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

/** Data de nascimento: vazia, ou no passado e depois de 1900. */
export function nascimentoValido(data: string, hoje = new Date()) {
  if (!data) return true;
  const [ano, mes, dia] = data.split("-").map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  return ano >= 1900 && nascimento <= hoje;
}
