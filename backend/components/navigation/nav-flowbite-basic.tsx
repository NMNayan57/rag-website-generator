import React from "react";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

interface NavFlowbiteBasicProps {
  brandName?: string;
  logoSrc?: string;
  links?: Array<{ name: string; href: string; active?: boolean }>;
}

export const NavFlowbiteBasic: React.FC<NavFlowbiteBasicProps> = ({
  brandName = "Flowbite React",
  logoSrc = "/favicon.svg",
  links = [
    { name: "Home", href: "/", active: true },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" }
  ]
}) => {
  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/">
        <img src={logoSrc} className="mr-3 h-6 sm:h-9" alt={`${brandName} Logo`} />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          {brandName}
        </span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        {links.map((link, index) => (
          <NavbarLink key={index} href={link.href} active={link.active}>
            {link.name}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </Navbar>
  );
};