import React, { useState } from "react";

interface NavPrelineMegaProps {
  brandName?: string;
  logoSrc?: string;
  megaMenuItems?: Record<string, Array<{ title: string; desc: string; href: string; icon?: string }>>;
  ctaButton?: { text: string; href: string };
}

export const NavPrelineMega: React.FC<NavPrelineMegaProps> = ({
  brandName = "Preline",
  logoSrc = "/logo.svg",
  megaMenuItems = {
    Products: [
      { title: "Analytics", desc: "Advanced data insights", href: "/analytics", icon: "📊" },
      { title: "CRM", desc: "Customer relationship tools", href: "/crm", icon: "👥" },
      { title: "Marketing", desc: "Campaign management", href: "/marketing", icon: "📈" }
    ],
    Company: [
      { title: "About Us", desc: "Learn about our story", href: "/about", icon: "🏢" },
      { title: "Careers", desc: "Join our team", href: "/careers", icon: "💼" },
      { title: "Press", desc: "News and updates", href: "/press", icon: "📰" }
    ]
  },
  ctaButton = { text: "Get Started", href: "/signup" }
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b border-gray-200">
      <nav className="relative max-w-[85rem] w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-x-1">
          <a className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80" href="/" aria-label="Brand">
            <img src={logoSrc} alt={brandName} className="w-8 h-8 inline mr-2" />
            {brandName}
          </a>

          <button 
            type="button" 
            className="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-[12px] rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            id="hs-header-base-collapse"
            aria-expanded="false"
            aria-controls="hs-header-base"
            aria-label="Toggle navigation"
          >
            <svg className="hs-collapse-open:hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="6" y2="6"/>
              <line x1="3" x2="21" y1="12" y2="12"/>
              <line x1="3" x2="21" y1="18" y2="18"/>
            </svg>
            <svg className="hs-collapse-open:block shrink-0 hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div id="hs-header-base" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block" aria-labelledby="hs-header-base-collapse">
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">

              {Object.entries(megaMenuItems).map(([category, items]) => (
                <div key={category} className="hs-dropdown [--strategy:static] md:[--strategy:absolute] [--adaptive:none] [--is-collapse:true] md:[--is-collapse:false] relative">
                  <button 
                    id={`hs-header-base-mega-menu-${category.toLowerCase()}`}
                    type="button" 
                    className="hs-dropdown-toggle w-full p-2 flex items-center font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-label={`${category} mega menu"`}
                  >
                    {category}
                    <svg className="hs-dropdown-open:-rotate-180 md:hs-dropdown-open:rotate-0 duration-300 shrink-0 size-4 ms-auto md:ms-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>

                  <div className="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] md:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 relative md:w-80 hidden z-10 md:mt-2 md:bg-white md:rounded-lg md:shadow-md before:absolute before:-top-4 before:start-0 before:w-full before:h-5">
                    <div className="py-1 md:px-1">
                      {items.map((item, index) => (
                        <a key={index} className="p-3 flex gap-x-4 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg" href={item.href}>
                          <div className="shrink-0 mt-1">
                            <span className="text-2xl">{item.icon}</span>
                          </div>
                          <div className="grow">
                            <p className="font-medium text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <a className="p-2 flex items-center font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500" href="/pricing">
                Pricing
              </a>

              <div className="relative flex flex-wrap items-center gap-x-1.5 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-gray-300 before:-translate-y-1/2">
                <a className="p-2 w-full flex items-center font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500" href="/login">
                  Log in
                </a>
                <a className="p-2 w-full flex items-center font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:text-gray-500" href={ctaButton.href}>
                  {ctaButton.text}
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};