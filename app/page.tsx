import AboutEvent from "./components/AboutEvent";
import AboutOrganizers from "./components/AboutOrganizers";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import HeroExperience from "./components/HeroExperience";
import Navbar from "./components/Navbar";
import Prizepool from "./components/Prizepool";
import Schedule from "./components/Schedule";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroExperience />
        <AboutEvent />
        <AboutOrganizers />
        <Prizepool />
        <Schedule />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
