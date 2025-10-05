import React from "react";

interface FooterDaisyUIGridProps {
  companyName?: string;
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  socialIcons?: Array<{ name: string; href: string; icon: React.ReactNode }>;
}

export const FooterDaisyUIGrid: React.FC<FooterDaisyUIGridProps> = ({
  companyName = "ACME Ltd",
  sections = [
    {
      title: "Services",
      links: [
        { name: "Branding", href: "/branding" },
        { name: "Design", href: "/design" },
        { name: "Marketing", href: "/marketing" },
        { name: "Advertisement", href: "/advertisement" }
      ]
    },
    {
      title: "Company", 
      links: [
        { name: "About us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Jobs", href: "/jobs" },
        { name: "Press kit", href: "/press" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of use", href: "/terms" },
        { name: "Privacy policy", href: "/privacy" },
        { name: "Cookie policy", href: "/cookies" }
      ]
    }
  ],
  socialIcons = []
}) => {
  return (
    <footer className="footer bg-base-200 text-base-content p-10">
      <nav>
        <h6 className="footer-title">{companyName}</h6>
        <p>Providing reliable tech since 1992</p>
        <div className="grid grid-flow-col gap-4">
          {socialIcons.map((social, index) => (
            <a key={index} href={social.href} className="link">
              {social.icon}
            </a>
          ))}
        </div>
      </nav>
      {sections.map((section, sectionIndex) => (
        <nav key={sectionIndex}>
          <h6 className="footer-title">{section.title}</h6>
          {section.links.map((link, linkIndex) => (
            <a key={linkIndex} href={link.href} className="link link-hover">
              {link.name}
            </a>
          ))}
        </nav>
      ))}
    </footer>
  );
};