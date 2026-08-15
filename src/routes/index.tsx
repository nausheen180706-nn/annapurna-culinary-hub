import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { MenuSection } from "@/components/site/MenuSection";
import { Packages } from "@/components/site/Packages";
import { Gallery } from "@/components/site/Gallery";
import { WhyUs } from "@/components/site/WhyUs";
import { BookingSection } from "@/components/site/BookingSection";
import { Testimonials } from "@/components/site/Testimonials";
import { ContactSection } from "@/components/site/ContactSection";
import { Footer } from "@/components/site/Footer";
import { AIAssistant } from "@/components/site/AIAssistant";
import { EnquiryProvider } from "@/lib/enquiry";
import { CinematicIntro } from "@/components/site/CinematicIntro";

const TITLE = "Annapurnam Catering Service | Premium Indian Event Catering";
const DESCRIPTION =
  "Authentic Indian catering for weddings, birthdays, corporate and family events. Biryani, South Indian feasts, live counters and packages from ₹299 per person.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [startHero, setStartHero] = useState(false);

  // Handle intro completion unmounting
  useEffect(() => {
    if (startHero) {
      // Unmount the intro overlay completely after the transition animation finishes (1s)
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [startHero]);

  return (
    <EnquiryProvider>
      {showIntro && <CinematicIntro onComplete={() => setStartHero(true)} />}
      <Navbar />
      <main>
        <Hero animate={startHero} />
        <About />
        <Services />
        <MenuSection />
        <Packages
          onChoose={(name) => {
            setSelectedPackage(name);
            document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
        <Gallery />
        <WhyUs />
        <BookingSection selectedPackage={selectedPackage} onPackageChange={setSelectedPackage} />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
      <AIAssistant />
    </EnquiryProvider>
  );
}
