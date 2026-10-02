import AboutBlock from "./AboutBlock";
import Steps from "./Steps";

export default function HowWeWork() {
  return (
    // scroll-mt-16: al llegar por #como-trabajamos el header (h-16) no tapa
    // el inicio de la sección.
    <section
      id="como-trabajamos"
      aria-label="Cómo trabajamos"
      className="scroll-mt-16 bg-cream py-20 text-ink lg:py-32"
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <AboutBlock />
        <Steps />
      </div>
    </section>
  );
}
