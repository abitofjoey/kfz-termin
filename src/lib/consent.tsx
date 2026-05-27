import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentState = {
  categories: ConsentCategories;
  decidedAt: string | null;
  version: number;
};

const STORAGE_KEY = "kfz-consent-v1";
const VERSION = 1;

const DEFAULT_STATE: ConsentState = {
  categories: { necessary: true, analytics: false, marketing: false },
  decidedAt: null,
  version: VERSION,
};

type ConsentContextValue = {
  state: ConsentState;
  hasDecided: boolean;
  hydrated: boolean;
  settingsOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePartial: (partial: Partial<Pick<ConsentCategories, "analytics" | "marketing">>) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStorage(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(state: ConsentState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function clearCookies(names: string[]) {
  if (typeof document === "undefined") return;
  const hosts = [window.location.hostname, `.${window.location.hostname}`];
  // also try the apex domain
  const parts = window.location.hostname.split(".");
  if (parts.length > 2) hosts.push(`.${parts.slice(-2).join(".")}`);
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name) return;
    if (names.some((prefix) => name === prefix || name.startsWith(prefix))) {
      hosts.forEach((domain) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConsentState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  const commit = useCallback((next: ConsentState, previous: ConsentState) => {
    setState(next);
    writeStorage(next);
    // Cookies bei Widerruf entfernen
    if (previous.categories.analytics && !next.categories.analytics) {
      clearCookies(["_ga", "_gid", "_gat", "_hj"]);
    }
    if (previous.categories.marketing && !next.categories.marketing) {
      clearCookies(["_gcl", "_gac"]);
    }
    window.dispatchEvent(new CustomEvent("consent-changed", { detail: next }));
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      categories: { necessary: true, analytics: true, marketing: true },
      decidedAt: new Date().toISOString(),
      version: VERSION,
    };
    commit(next, state);
    setSettingsOpen(false);
  }, [commit, state]);

  const rejectAll = useCallback(() => {
    const next: ConsentState = {
      categories: { necessary: true, analytics: false, marketing: false },
      decidedAt: new Date().toISOString(),
      version: VERSION,
    };
    commit(next, state);
    setSettingsOpen(false);
  }, [commit, state]);

  const savePartial = useCallback(
    (partial: Partial<Pick<ConsentCategories, "analytics" | "marketing">>) => {
      const next: ConsentState = {
        categories: {
          necessary: true,
          analytics: partial.analytics ?? state.categories.analytics,
          marketing: partial.marketing ?? state.categories.marketing,
        },
        decidedAt: new Date().toISOString(),
        version: VERSION,
      };
      commit(next, state);
      setSettingsOpen(false);
    },
    [commit, state],
  );

  return (
    <ConsentContext.Provider
      value={{
        state,
        hasDecided: state.decidedAt !== null,
        hydrated,
        settingsOpen,
        acceptAll,
        rejectAll,
        savePartial,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
