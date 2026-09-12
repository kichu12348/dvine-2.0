import AboutEvent from "./components/AboutEvent";
import AboutOrganizers from "./components/AboutOrganizers";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Partners from "./components/Partners";
import Prizepool from "./components/Prizepool";
import Schedule from "./components/Schedule";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutEvent />
        <AboutOrganizers />
        <Prizepool />
        <Partners />
        <Schedule />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
