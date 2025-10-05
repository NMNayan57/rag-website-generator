import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

interface FooterHeadlessUIDisclosureProps {
  companyName?: string;
  description?: string;
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string; description?: string }>;
  }>;
  legalLinks?: Array<{ name: string; href: string }>;
}

export const FooterHeadlessUIDisclosure: React.FC<FooterHeadlessUIDisclosureProps> = ({
  companyName = "Your Company",
  description = "Making the world a better place through constructing elegant hierarchies.",
  sections = [
    {
      title: "Solutions",
      links: [
        { name: "Marketing", href: "/marketing", description: "Grow your customer base" },
        { name: "Analytics", href: "/analytics", description: "Track your progress" },
        { name: "Commerce", href: "/commerce", description: "Sell your products" },
        { name: "Insights", href: "/insights", description: "Deep business intelligence" }
      ]
    },
    {
      title: "Support", 
      links: [
        { name: "Pricing", href: "/pricing", description: "Transparent pricing plans" },
        { name: "Documentation", href: "/docs", description: "Complete guides" },
        { name: "Guides", href: "/guides", description: "Step-by-step tutorials" },
        { name: "API Status", href: "/status", description: "Real-time status updates" }
      ]
    }
  ],
  legalLinks = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Cookies", href: "/cookies" }
  ]
}) => {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mt-10 md:mt-0">
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <DisclosureButton className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 md:bg-transparent md:p-0 md:hover:bg-transparent">
                          <h3 className="text-sm font-semibold leading-6 text-gray-900">
                            {section.title}
                          </h3>
                          <ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500 md:hidden`}
                          />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-6 space-y-4 md:mt-0">
                          <ul role="list" className="mt-6 space-y-4">
                            {section.links.map((link) => (
                              <li key={link.name}>
                                <a href={link.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                  <div className="font-medium">{link.name}</div>
                                  {link.description && (
                                    <div className="text-xs text-gray-500 mt-1">{link.description}</div>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 xl:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-gray-900">
              {companyName}
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              {description}
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="flex flex-wrap items-center justify-between">
            <p className="text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} {companyName}, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-xs leading-5 text-gray-500 hover:text-gray-900"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};