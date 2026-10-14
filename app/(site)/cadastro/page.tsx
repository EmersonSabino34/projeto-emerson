import FormularioCadastro from "@/components/FormularioCadastro";

export const metadata = { title: "Criar conta" };

/**
 * A página fica no servidor para poder exportar `metadata`, que dá o título
 * da aba. O formulário, que tem estado, mora em components/FormularioCadastro.
 */
export default function CadastroPage() {
  return <FormularioCadastro />;
}
