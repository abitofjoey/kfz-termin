// Städte/Behörden in den Rechtstexten (AGB, Datenschutz, Widerrufsbelehrung).
// Bewusst NICHT aus launchedCities() abgeleitet: Rechtstexte werden manuell
// gepflegt. Bei einer neuen Stadt hier ergänzen und LEGAL_STAND anpassen.

export const LEGAL_STAND = "Stand: November 2026";

/** "Stadt Köln und Stadt Bonn" (Widerrufsbelehrung). */
export const LEGAL_CITIES = "Stadt Köln und Stadt Bonn";

/** "die Stadt Köln und die Stadt Bonn" (Datenschutz). */
export const LEGAL_CITIES_WITH_ARTICLES = "die Stadt Köln und die Stadt Bonn";

/** Behördenliste in den AGB (§ 2 Abs. 1). */
export const LEGAL_AUTHORITIES_AGB =
  "die Kfz-Zulassungsstelle der Stadt Köln sowie die Kfz-Zulassung und Führerscheinstelle der Stadt Bonn";
