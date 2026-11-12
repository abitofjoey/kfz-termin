import { koelnContent, type CityContent } from "./koeln";
import { bonnContent } from "./bonn";
import { recklinghausenContent } from "./recklinghausen";

/** Seiteninhalte pro Stadt. Eine Stadt ohne Eintrag hat keine Seite (404). */
export const CITY_CONTENT: Record<string, CityContent> = {
  koeln: koelnContent,
  bonn: bonnContent,
  recklinghausen: recklinghausenContent,
};

export type { CityContent };
