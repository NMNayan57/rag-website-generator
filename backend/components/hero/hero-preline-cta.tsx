import React from "react";

interface HeroPrelineCTAProps {
  title?: string;
  subtitle?: string;
  features?: Array<string>;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
}

export const HeroPrelineCTA: React.FC<HeroPrelineCTAProps> = ({
  title = "Grow your business with our SaaS solution",
  subtitle = "We help businesses of all sizes unlock their potential with our comprehensive platform designed for scale, security, and success.",
  features = [
    "Free migration assistance",
    "24/7 customer support", 
    "99.9% uptime guarantee",
    "Advanced security features"
  ],
  primaryCta = { text: "Start free trial", href: "/trial" },
  secondaryCta = { text: "Schedule demo", href: "/demo" }
}) => {
  return (
    <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/squared-bg-element.svg')] before:bg-no-repeat before:bg-top before:size-full before:-z-[1] before:transform before:-translate-x-1/2">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="flex justify-center">
          <a className="inline-flex items-center gap-x-2 bg-white border border-gray-200 text-xs text-gray-600 p-2 px-3 rounded-full transition hover:border-gray-300 focus:outline-none focus:border-gray-300" href="#">
            Explore the Capital Product
            <span className="flex items-center gap-x-1">
              <span className="border-s border-gray-200 text-blue-600 ps-2">Explore</span>
              <svg className="shrink-0 size-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </span>
          </a>
        </div>

        <div className="mt-5 max-w-xl text-center mx-auto">
          <h1 className="block font-bold text-gray-800 text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>

        <div className="mt-5 max-w-3xl text-center mx-auto">
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="mt-8 grid gap-3 w-full sm:inline-flex sm:justify-center">
          <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700" href={primaryCta.href}>
            {primaryCta.text}
            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </a>
          <a className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50" href={secondaryCta.href}>
            {secondaryCta.text}
          </a>
        </div>

        <div className="mt-5 flex justify-center items-center gap-x-1 sm:gap-x-3">
          <span className="text-sm text-gray-600">Package includes:</span>
          <span className="text-sm font-bold text-gray-900">{features.join(" • ")}</span>
        </div>
      </div>
    </div>
  );
};