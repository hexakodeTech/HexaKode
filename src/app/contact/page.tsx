import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import ContactHero from "../../components/contact/ContactHero";
import ContactGridSection from "../../components/contact/ContactGridSection";
import FAQSection from "../../components/contact/FAQSection";
import GoogleReviewCTA from "../../components/common/GoogleReviewCTA";

export const metadata = {
  title: "Contact Us | HexaKode Engineering",
  description: "Ready to engineer excellence? Contact HexaKode to scope your project, hire a dedicated development team, or schedule a free consultation.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-[112px] md:pt-[100px]">
        {/* Hero Area */}
        <ContactHero />

        {/* Form and Details Grid (Scroll-driven background shift) */}
        <ContactGridSection />


        {/* FAQ Section */}
        <FAQSection />

        {/* Google Reviews Card */}
        <div className="py-12 md:py-16 border-t border-outline-variant/10 bg-slate-50/20">
          <GoogleReviewCTA variant="card" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
