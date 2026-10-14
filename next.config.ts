import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Endereços da versão de antes dos route groups, que não existem mais.
   * Temporários (307) de propósito: é protótipo, e um 308 ficaria gravado no
   * navegador se essas URLs voltarem a ter página própria.
   */
  async redirects() {
    return [
      { source: "/categorias", destination: "/explorar", permanent: false },
      { source: "/ia", destination: "/mural", permanent: false },
    ];
  },
};

export default nextConfig;
