import NavRail from "@/components/NavRail";

/**
 * Shell das telas internas: barra inferior no mobile, trilha lateral a partir
 * de 1024px. As telas públicas ficam no grupo (site) e não passam por aqui.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <NavRail />
      <div className="app-main">{children}</div>
    </div>
  );
}
