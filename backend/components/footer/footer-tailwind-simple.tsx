import React from "react";

interface FooterTailwindSimpleProps {
  companyName?: string;
  links?: Array<{ name: string; href: string }>;
}

export const FooterTailwindSimple: React.FC<FooterTailwindSimpleProps> = ({
  companyName = "Your Company",
  links = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Jobs", href: "/jobs" },
    { name: "Press", href: "/press" },
    { name: "Accessibility", href: "/accessibility" },
    { name: "Partners", href: "/partners" }
  ]
}) => {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-400 hover:text-gray-500"
            >
              {link.name}
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} {companyName}, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};