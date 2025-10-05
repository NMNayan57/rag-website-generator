import React, { useState } from "react";

interface FooterFlowbiteNewsletterProps {
  brandName?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  columns?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
}

export const FooterFlowbiteNewsletter: React.FC<FooterFlowbiteNewsletterProps> = ({
  brandName = "Flowbite",
  newsletterTitle = "Subscribe to our newsletter",
  newsletterDescription = "Stay up to date with our latest news and products.",
  columns = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Brand Center", href: "/brand" },
        { name: "Blog", href: "/blog" }
      ]
    },
    {
      title: "Help center",
      links: [
        { name: "Discord Server", href: "/discord" },
        { name: "Twitter", href: "/twitter" },
        { name: "Facebook", href: "/facebook" },
        { name: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Licensing", href: "/licensing" },
        { name: "Terms & Conditions", href: "/terms" }
      ]
    }
  ]
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
  };

  return (
    <footer className="bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <img src="/favicon.svg" className="h-8 me-3" alt={`${brandName} Logo`} />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                {brandName}
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {columns.map((column, index) => (
              <div key={index}>
                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase text-white">
                  {column.title}
                </h2>
                <ul className="text-gray-500 font-medium">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="mb-4">
                      <a href={link.href} className="hover:underline">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {newsletterTitle}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {newsletterDescription}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a href="/" className="hover:underline">
              {brandName}™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};