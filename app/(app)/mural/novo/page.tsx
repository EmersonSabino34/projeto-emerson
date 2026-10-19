import Ambience from "@/components/Ambience";
import CriadorMural from "@/components/CriadorMural";

export const metadata = { title: "Novo mural" };

/**
 * Criar mural por toque (telas 25 e 26).
 *
 * A página fica no servidor para exportar `metadata`; as perguntas, que têm
 * estado, vão para o cliente (components/CriadorMural). O cabeçalho mora lá
 * dentro porque o título é a pergunta da vez.
 */
export default function NovoMuralPage() {
  return (
    <main className="page page-wizard" data-ambience="aurora">
      <Ambience />
      <CriadorMural />
    </main>
  );
}
