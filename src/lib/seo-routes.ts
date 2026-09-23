// Per-page SEO metadata. Also imported by vite.config.ts to build sitemap.xml,
// so keep this file free of "@/..." imports and browser APIs.

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
}

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: "/",
    title: "Medical Bay — Votre partenaire de santé à Agadir, Maroc",
    description:
      "Medical Bay : tourisme médical & dentisterie esthétique à Agadir. Soins d'excellence, cliniques partenaires, accompagnement complet.",
  },
  {
    path: "/dentisterie-esthetique",
    title: "Dentisterie esthétique à Agadir — Facettes, implants, couronnes | Medical Bay",
    description:
      "Facettes Zircon & E-max, implants dentaires, couronnes zirconium, aligneurs et blanchiment laser à Agadir. Devis gratuit avec Medical Bay.",
  },
  {
    path: "/tourisme-medical",
    title: "Tourisme médical au Maroc — Soins à Agadir | Medical Bay",
    description:
      "Soignez-vous à Agadir avec Medical Bay : cliniques partenaires, séjour organisé et accompagnement complet, de votre arrivée à votre retour.",
  },
  {
    path: "/packs",
    title: "Packs soins & séjour à Agadir | Medical Bay",
    description:
      "Découvrez les packs Medical Bay : soins dentaires et esthétiques, hébergement et accompagnement réunis dans une seule offre à Agadir.",
  },
  {
    path: "/a-propos",
    title: "À propos de Medical Bay — Tourisme médical à Agadir",
    description:
      "Qui est Medical Bay ? Notre équipe, nos cliniques partenaires et notre engagement pour des soins d'excellence à Agadir, Maroc.",
  },
  {
    path: "/contact",
    title: "Contact & devis gratuit | Medical Bay Agadir",
    description:
      "Contactez Medical Bay pour un devis gratuit et personnalisé : dentisterie esthétique et tourisme médical à Agadir, Maroc.",
  },
];

// Pages that must never appear in Google.
export const NOINDEX_PATHS = ["/admin"];
