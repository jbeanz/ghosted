import { TrackLink } from "@/components/TrackLink";
import { ExampleVerdicts } from "@/components/landing/ExampleVerdicts";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PrivacyBlurb } from "@/components/landing/PrivacyBlurb";
import { SampleReport } from "@/components/landing/SampleReport";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <SampleReport />
      <HowItWorks />
      <ExampleVerdicts />
      <PrivacyBlurb />
      <div className="mt-12 text-center">
        <TrackLink
          event="click_analyze_cta"
          href="/analyze"
          className="inline-flex rounded-full bg-mint px-7 py-3.5 font-semibold text-night"
        >
          Analyze My Texts
        </TrackLink>
      </div>
    </div>
  );
}
