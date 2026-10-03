import BusinessCard from "./BusinessCard";
import ServiceList from "./ServiceList";

export default function Services() {
  return (
    <section
      id="empresas"
      aria-label="Empresas y más servicios"
      className="scroll-mt-16 bg-cream py-20 text-ink lg:py-32"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 px-6 md:px-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <BusinessCard />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <ServiceList />
        </div>
      </div>
    </section>
  );
}
