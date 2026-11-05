import { koelnContent, type CityContent } from "./koeln";
import { bonnContent } from "./bonn";

/** Seiteninhalte pro Stadt. Eine Stadt ohne Eintrag hat keine Seite (404). */
export const CITY_CONTENT: Record<string, CityContent> = {
  koeln: koelnContent,
  bonn: bonnContent,
};

export type { CityContent };
