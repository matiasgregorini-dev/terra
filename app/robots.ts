import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // El portal y sus pantallas de acceso son privados: no se indexan.
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/portal", "/ingresar", "/recuperar", "/auth"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
