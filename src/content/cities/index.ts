import { koelnContent, type CityContent } from "./koeln";

/** Seiteninhalte pro Stadt. Eine Stadt ohne Eintrag hat keine Seite (404). */
export const CITY_CONTENT: Record<string, CityContent> = {
  koeln: koelnContent,
};

export type { CityContent };
