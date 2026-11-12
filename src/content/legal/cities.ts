// Städte/Behörden in den Rechtstexten (AGB, Datenschutz, Widerrufsbelehrung).
// Bewusst NICHT aus launchedCities() abgeleitet: Rechtstexte werden manuell
// gepflegt. Bei einer neuen Stadt hier ergänzen und LEGAL_STAND anpassen.

export const LEGAL_STAND = "Stand: November 2026";

/** "Stadt Köln und Stadt Bonn" (Widerrufsbelehrung). */
export const LEGAL_CITIES = "Stadt Köln, Stadt Bonn und Kreis Recklinghausen";

/** "die Stadt Köln und die Stadt Bonn" (Datenschutz). */
export const LEGAL_CITIES_WITH_ARTICLES = "die Stadt Köln, die Stadt Bonn und der Kreis Recklinghausen";

/** Behördenliste in den AGB (§ 2 Abs. 1). */
export const LEGAL_AUTHORITIES_AGB =
  "die Kfz-Zulassungsstelle der Stadt Köln, die Kfz-Zulassung und Führerscheinstelle der Stadt Bonn sowie die Kfz-Zulassungsstelle des Kreises Recklinghausen in Marl";
