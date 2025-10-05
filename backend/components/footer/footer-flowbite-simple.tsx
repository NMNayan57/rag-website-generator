import React from "react";
import { Footer, FooterBrand, FooterCopyright, FooterLink, FooterLinkGroup } from "flowbite-react";

interface FooterFlowbiteSimpleProps {
  brandName?: string;
  brandHref?: string;
  logoSrc?: string;
  links?: Array<{ name: string; href: string }>;
  socialLinks?: Array<{ name: string; href: string; icon: React.ReactNode }>;
}

export const FooterFlowbiteSimple: React.FC<FooterFlowbiteSimpleProps> = ({
  brandName = "Flowbite",
  brandHref = "/",
  logoSrc = "/favicon.svg",
  links = [
    { name: "About", href: "/about" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Licensing", href: "/licensing" },
    { name: "Contact", href: "/contact" }
  ],
  socialLinks = []
}) => {
  return (
    <Footer container>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <FooterBrand
              href={brandHref}
              src={logoSrc}
              alt={`${brandName} Logo`}
              name={brandName}
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <FooterLinkGroup col>
                {links.map((link, index) => (
                  <FooterLink key={index} href={link.href}>
                    {link.name}
                  </FooterLink>
                ))}
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright href={brandHref} by={brandName} year={new Date().getFullYear()} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Footer>
  );
};