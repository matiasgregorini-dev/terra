import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-50 rounded-md bg-verde px-4 py-2 text-crema focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        <Hero />
        <About />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
