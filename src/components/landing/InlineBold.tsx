/**
 * Rendert Text mit **fett**-Markierungen als <strong>.
 * Wird für Hinweise aus der Stadt-Konfiguration genutzt, damit die Texte dort stehen und nicht im JSX.
 */
export function InlineBold({ text }: { text: string }) {
  return (
    <>
      {text
        .split("**")
        .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
    </>
  );
}
