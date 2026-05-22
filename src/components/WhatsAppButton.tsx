import { useEffect, useState } from "react";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="https://wa.me/4917643477088?text=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20KFZ-Termin%20K%C3%B6ln%3A"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Kontakt"
      className={`group fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
        Fragen? Schreib uns!
      </span>
      <span
        className="flex items-center justify-center rounded-full shadow-lg animate-[wa-pulse_3s_ease-in-out_infinite] hover:scale-110 transition-transform"
        style={{
          backgroundColor: "#25D366",
          width: "var(--wa-size, 48px)",
          height: "var(--wa-size, 48px)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="white"
          className="w-7 h-7 md:w-8 md:h-8"
          aria-hidden="true"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.13-.616.13-.946 0-.143-.13-.215-.36-.33-.288-.144-1.665-.818-1.866-.818zm-2.78 6.45c-5.187 0-9.412-4.225-9.412-9.412 0-5.186 4.225-9.412 9.412-9.412 5.186 0 9.412 4.226 9.412 9.412 0 5.187-4.226 9.412-9.412 9.412zm0-20.71C9.945 2.945 4.83 8.06 4.83 14.244c0 2.094.575 4.144 1.664 5.92L4.5 26.34l6.32-1.992a11.275 11.275 0 0 0 5.51 1.42c6.18 0 11.296-5.116 11.296-11.3.005-3.32-1.55-5.92-3.27-7.79-1.65-1.91-4.51-3.733-7.81-3.733z" />
        </svg>
      </span>
      <style>{`
        @keyframes wa-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </a>
  );
}
