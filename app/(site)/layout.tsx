import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

/** Shell das telas públicas: landing, cadastro e login. Sem NavRail. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>© {new Date().getFullYear()} VYRA</p>
        <nav aria-label="Links do rodapé">
          <Link href="/login">Entrar</Link>
          <Link href="/cadastro">Criar conta</Link>
        </nav>
      </footer>
    </div>
  );
}
