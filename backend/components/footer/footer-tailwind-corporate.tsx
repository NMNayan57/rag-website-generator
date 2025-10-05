import React from "react";

interface FooterTailwindCorporateProps {
  company?: {
    name: string;
    description: string;
    logoSrc: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  social?: Array<{
    name: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

export const FooterTailwindCorporate: React.FC<FooterTailwindCorporateProps> = ({
  company = {
    name: "Your Company",
    description: "Making the world a better place through constructing elegant hierarchies.",
    logoSrc: "https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
  },
  sections = [
    {
      title: "Solutions",
      links: [
        { name: "Marketing", href: "/marketing" },
        { name: "Analytics", href: "/analytics" },
        { name: "Commerce", href: "/commerce" },
        { name: "Insights", href: "/insights" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Pricing", href: "/pricing" },
        { name: "Documentation", href: "/docs" },
        { name: "Guides", href: "/guides" },
        { name: "API Status", href: "/status" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Jobs", href: "/jobs" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Claim", href: "/claim" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" }
      ]
    }
  ],
  social = []
}) => {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <img className="h-7" src={company.logoSrc} alt={company.name} />
            <p className="text-sm leading-6 text-gray-300">
              {company.description}
            </p>
            {social.length > 0 && (
              <div className="flex space-x-6">
                {social.map((item) => (
                  <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">{item.name}</span>
                    {item.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.slice(0, 2).map((section, index) => (
                <div key={index} className={index > 0 ? 'mt-10 md:mt-0' : ''}>
                  <h3 className="text-sm font-semibold leading-6 text-white">{section.title}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.slice(2, 4).map((section, index) => (
                <div key={index} className={index > 0 ? 'mt-10 md:mt-0' : ''}>
                  <h3 className="text-sm font-semibold leading-6 text-white">{section.title}</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-sm leading-6 text-gray-300 hover:text-white">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; {new Date().getFullYear()} {company.name}, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};