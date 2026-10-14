import FormularioLogin from "@/components/FormularioLogin";

export const metadata = { title: "Entrar" };

/**
 * A página fica no servidor para poder exportar `metadata`, que dá o título
 * da aba. O formulário, que tem estado, mora em components/FormularioLogin.
 */
export default function LoginPage() {
  return <FormularioLogin />;
}
