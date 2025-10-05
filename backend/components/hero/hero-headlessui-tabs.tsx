import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface HeroHeadlessUITabsProps {
  title?: string;
  description?: string;
  tabs?: Array<{
    name: string;
    content: {
      title: string;
      description: string;
      features: Array<string>;
      image: string;
    };
  }>;
  ctaButton?: { text: string; href: string };
}

export const HeroHeadlessUITabs: React.FC<HeroHeadlessUITabsProps> = ({
  title = "Everything you need to deploy your app",
  description = "Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.",
  tabs = [
    {
      name: "Analytics",
      content: {
        title: "Get actionable data that will help grow your business",
        description: "Lorem ipsum dolor sit amet consect adipisicing elit. Possimus magnam voluptatum cupiditate veritatis in accusamus quisquam.",
        features: ["Push to deploy", "SSL certificates", "Simple queues"],
        image: "https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
      }
    },
    {
      name: "Reports", 
      content: {
        title: "Detailed reporting for all your campaigns",
        description: "Repudiandae et consectetur veritatis dicta aut sed sit laboriosam. Aspernatur amet voluptatem quas amet harum.",
        features: ["Advanced filtering", "Export options", "Custom dashboards"],
        image: "https://tailwindui.com/img/component-images/project-app-screenshot.png"
      }
    },
    {
      name: "Integrations",
      content: {
        title: "Connect with all your favorite tools",
        description: "Optio, dolorem molestiae. Sunt voluptatem fugit et sit explicabo enim adipisci labore in repellendus.",
        features: ["API access", "Webhooks", "Third-party apps"],
        image: "https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
      }
    }
  ],
  ctaButton = { text: "Get started", href: "/signup" }
}) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {title}
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {description}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <TabGroup>
            <TabList className="flex gap-x-8 border-b border-gray-200">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className="border-b-2 border-transparent pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[selected]:border-indigo-500 data-[selected]:text-indigo-600 focus:outline-none"
                >
                  {tab.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-8">
              {tabs.map((tab, index) => (
                <TabPanel key={index} className="lg:grid lg:grid-cols-12 lg:gap-x-8">
                  <div className="lg:col-span-5">
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                      {tab.content.title}
                    </h3>
                    <p className="mt-4 text-lg text-gray-600">
                      {tab.content.description}
                    </p>
                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                      {tab.content.features.map((feature) => (
                        <div key={feature} className="relative pl-9">
                          <dt className="inline font-semibold text-gray-900">
                            <svg className="absolute left-1 top-1 h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </dt>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-10">
                      <a
                        href={ctaButton.href}
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {ctaButton.text}
                      </a>
                    </div>
                  </div>
                  <div className="mt-10 lg:col-span-7 lg:mt-0">
                    <img
                      className="w-full rounded-xl shadow-xl ring-1 ring-gray-400/10"
                      src={tab.content.image}
                      alt={tab.content.title}
                    />
                  </div>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
};