import { useEffect, useState } from "react";
import { X } from "lucide-react";

const WA_HREF =
  "https://wa.me/4915153461798?text=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20KFZ-Termin%20K%C3%B6ln%3A";
const DISMISS_KEY = "wa-prompt-dismissed";
const PROMPT_DELAY_MS = 30_000;

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setVisible(scrolled);
  }, [scrolled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
      return;
    }
    const t = setTimeout(() => setShowPrompt(true), PROMPT_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const promptActive = showPrompt && scrolled && !dismissed;

  return (
    <aside
      aria-label="Direktkontakt per WhatsApp"
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {promptActive && (
        <div
          role="dialog"
          aria-label="WhatsApp Kontakt"
          className="relative w-[260px] md:w-[280px] rounded-2xl bg-white shadow-xl border border-border p-4 pr-8 animate-[wa-prompt-in_0.35s_ease-out]"
        >
          <button
            onClick={dismiss}
            aria-label="Schließen"
            className="absolute top-2 right-2 p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-sm font-semibold text-foreground">Fragen?</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Schreib uns direkt bei WhatsApp – wir melden uns schnellstmöglich bei dir.
          </p>
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
            className="mt-3 inline-flex items-center justify-center w-full rounded-md px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            Bei WhatsApp schreiben
          </a>
          {/* Pfeil nach unten Richtung Button */}
          <span
            className="absolute -bottom-1.5 right-8 w-3 h-3 rotate-45 bg-white border-r border-b border-border"
            aria-hidden="true"
          />
        </div>
      )}

      <a
        href={WA_HREF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Kontakt"
        className="group relative"
      >
        <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Fragen? Schreib uns!
        </span>
        <span className="block animate-[wa-pulse_3s_ease-in-out_infinite] hover:scale-110 transition-transform drop-shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 72"
            className="w-[72px] h-[44px] md:w-[88px] md:h-[54px]"
            aria-hidden="true"
          >
            <path
              d="M8 52 C8 46 12 42 18 42 L28 42 L38 24 C40 20 44 18 48 18 L82 18 C86 18 90 20 92 24 L102 42 L108 42 C113 42 116 46 116 50 L116 56 C116 59 114 61 111 61 L102 61 A14 14 0 0 0 74 61 L46 61 A14 14 0 0 0 18 61 L13 61 C10 61 8 59 8 56 Z"
              fill="#25D366"
            />
            <path
              d="M44 26 C45 23 47 22 50 22 L80 22 C83 22 85 23 86 26 L90 40 L40 40 Z"
              fill="#1faa52"
              opacity="0.55"
            />
            <circle cx="32" cy="61" r="10" fill="#1a1a1a" />
            <circle cx="32" cy="61" r="4" fill="#444" />
            <circle cx="88" cy="61" r="10" fill="#1a1a1a" />
            <circle cx="88" cy="61" r="4" fill="#444" />
            <g transform="translate(48 22) scale(0.75)">
              <path
                fill="white"
                d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.13-.616.13-.946 0-.143-.13-.215-.36-.33-.288-.144-1.665-.818-1.866-.818zm-2.78 6.45c-5.187 0-9.412-4.225-9.412-9.412 0-5.186 4.225-9.412 9.412-9.412 5.186 0 9.412 4.226 9.412 9.412 0 5.187-4.226 9.412-9.412 9.412zm0-20.71C9.945 2.945 4.83 8.06 4.83 14.244c0 2.094.575 4.144 1.664 5.92L4.5 26.34l6.32-1.992a11.275 11.275 0 0 0 5.51 1.42c6.18 0 11.296-5.116 11.296-11.3.005-3.32-1.55-5.92-3.27-7.79-1.65-1.91-4.51-3.733-7.81-3.733z"
              />
            </g>
          </svg>
        </span>
      </a>
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes wa-prompt-in {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </aside>
  );
}
