import React from "react";

interface FooterPrelineLinksProps {
  brandName?: string;
  brandDescription?: string;
  linkSections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  socialLinks?: Array<{ name: string; href: string; icon: React.ReactNode }>;
}

export const FooterPrelineLinks: React.FC<FooterPrelineLinksProps> = ({
  brandName = "Preline",
  brandDescription = "We're part of the Htmlstream family.",
  linkSections = [
    {
      title: "Product",
      links: [
        { name: "Pricing", href: "/pricing" },
        { name: "Changelog", href: "/changelog" },
        { name: "Docs", href: "/docs" },
        { name: "Download", href: "/download" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About us", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Careers", href: "/careers" },
        { name: "Customers", href: "/customers" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Community", href: "/community" },
        { name: "Help & Support", href: "/support" },
        { name: "eBook", href: "/ebook" },
        { name: "What's New", href: "/whats-new" }
      ]
    }
  ],
  socialLinks = []
}) => {
  return (
    <footer className="mt-auto bg-gray-900">
      <div className="max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 lg:pt-20 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div className="col-span-full lg:col-span-1">
            <a className="flex-none font-semibold text-xl text-white focus:outline-none focus:opacity-80" href="#" aria-label="Brand">
              {brandName}
            </a>
            <p className="mt-3 text-xs sm:text-sm text-gray-400">
              {brandDescription}
            </p>
          </div>

          {linkSections.map((section, index) => (
            <div key={index} className="col-span-1">
              <h4 className="font-semibold text-gray-100">{section.title}</h4>
              <div className="mt-3 grid space-y-3">
                {section.links.map((link, linkIndex) => (
                  <p key={linkIndex}>
                    <a className="inline-flex gap-x-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-200" href={link.href}>
                      {link.name}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 sm:mt-12 grid gap-y-2 sm:gap-y-0 sm:flex sm:justify-between sm:items-center">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <div className="space-x-4">
                {socialLinks.map((social, index) => (
                  <a key={index} className="inline-block text-gray-500 hover:text-gray-200 focus:outline-none focus:text-gray-200" href={social.href} target="_blank" rel="noopener noreferrer">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};