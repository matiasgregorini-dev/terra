import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Nosotros from "@/components/Nosotros";
import Profesional from "@/components/Profesional";
import Servicios from "@/components/Servicios";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-verde px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        <Hero />
        <Nosotros />
        <Servicios />
        <Profesional />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
