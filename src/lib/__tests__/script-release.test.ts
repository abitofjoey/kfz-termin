import { describe, it, expect } from "vitest";
import { extractMetaBlock, injectToken, safeEqual, validUpdateToken } from "../script-release";

describe("script-release", () => {
  it("Token unter 32 Zeichen gilt als fehlend", () => {
    expect(validUpdateToken("a".repeat(31))).toBeNull();
    expect(validUpdateToken(undefined)).toBeNull();
    expect(validUpdateToken("a".repeat(32))).toBe("a".repeat(32));
  });
  it("Vergleich", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "abcd")).toBe(false);
  });
  it("Kopfblock inkl. Endmarke", () => {
    const src = "// ==UserScript==\n// @version 40.3\n// ==/UserScript==\nalert(1)";
    expect(extractMetaBlock(src)).toBe("// ==UserScript==\n// @version 40.3\n// ==/UserScript==\n");
    expect(extractMetaBlock("alert(1)")).toBeNull();
  });
  it("ersetzt jeden Platzhalter", () => {
    expect(injectToken("a{{UPDATE_TOKEN}}b{{UPDATE_TOKEN}}", "T")).toBe("aTbT");
  });
});
