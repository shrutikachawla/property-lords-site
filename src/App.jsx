import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import ProcessSteps from "./sections/ProcessSteps";
import Listings from "./sections/Listings";
import About from "./sections/About";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <div className="font-body">
      <Navbar />
      <main>
        <Hero />
        <ProcessSteps />
        <Listings />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
