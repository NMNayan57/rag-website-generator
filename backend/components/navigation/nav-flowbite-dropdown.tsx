import React from "react";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

interface NavFlowbiteDropdownProps {
  brandName?: string;
  logoSrc?: string;
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
  links?: Array<{ name: string; href: string; active?: boolean }>;
  dropdownItems?: Array<{ name: string; href: string }>;
}

export const NavFlowbiteDropdown: React.FC<NavFlowbiteDropdownProps> = ({
  brandName = "Flowbite React",
  logoSrc = "/favicon.svg",
  userAvatar = "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
  userName = "Bonnie Green",
  userEmail = "name@flowbite.com",
  links = [
    { name: "Home", href: "/", active: true },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" }
  ],
  dropdownItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Settings", href: "/settings" },
    { name: "Earnings", href: "/earnings" }
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
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" img={userAvatar} rounded />}
        >
          <DropdownHeader>
            <span className="block text-sm">{userName}</span>
            <span className="block truncate text-sm font-medium">{userEmail}</span>
          </DropdownHeader>
          {dropdownItems.map((item, index) => (
            <DropdownItem key={index} href={item.href}>
              {item.name}
            </DropdownItem>
          ))}
          <DropdownDivider />
          <DropdownItem href="/logout">Sign out</DropdownItem>
        </Dropdown>
        <NavbarToggle />
      </div>
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