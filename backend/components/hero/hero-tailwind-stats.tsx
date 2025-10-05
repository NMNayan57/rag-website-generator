import React from "react";

interface HeroTailwindStatsProps {
  title?: string;
  description?: string;
  stats?: Array<{ value: string; label: string }>;
  ctaButton?: { text: string; href: string };
}

export const HeroTailwindStats: React.FC<HeroTailwindStatsProps> = ({
  title = "Deploy to the cloud with confidence",
  description = "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.",
  stats = [
    { value: "8,000+", label: "Companies" },
    { value: "25M+", label: "Endpoints" },
    { value: "98%", label: "Uptime" },
    { value: "12ms", label: "Latency" }
  ],
  ctaButton = { text: "Get started", href: "#" }
}) => {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={ctaButton.href}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {ctaButton.text}
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by creators worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Lorem ipsum dolor sit amet consect adipisicing possimus.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col bg-gray-400/5 p-8">
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
