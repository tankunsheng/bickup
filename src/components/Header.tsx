import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
export default ({ location }: any) => {
  interface INavLinks {
    label: string;
    toPath: string;
    isRootPath?: boolean
  }
  const NavLinks: Array<INavLinks> = [
    {
      label: "Home",
      toPath: "/",
      isRootPath: true
    },
    {
      label: "About",
      toPath: "/about",
    },
  ];

  return (
    <div>
      <header className="h-24 sm:h-32 flex items-center z-30 w-full">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="uppercase text-gray-800 dark:text-white font-black text-3xl">
            <StaticImage src="../images/icon.png" alt="bickup" width={64} />
          </div>
          <div className="flex items-center">
            <nav className="font-sen text-gray-800 dark:text-white uppercase text-lg lg:flex items-center hidden">
              {NavLinks.map((eachLink) => {
                return (
                  <Link
                    key={eachLink.label}
                    className={`py-2 px-6 flex ${
                      (location.pathname.substring(1) === eachLink.label.toLowerCase() 
                      || location.pathname==="/" && eachLink.isRootPath)
                        ? "text-indigo-500 border-b-2 border-indigo-500"
                        : "flex hover:text-indigo-500"
                    }`}
                    to={eachLink.toPath}
                  >
                    {eachLink.label}
                  </Link>
                );
              })}
            </nav>
            <button className="lg:hidden flex flex-col ml-4">
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
              <span className="w-6 h-1 bg-gray-800 dark:bg-white mb-1"></span>
            </button>
          </div>
        </div>
      </header>
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
          >
            Home
          </a>
          <a
            className="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
          >
            Gallery
          </a>
          <a
            className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
          >
            Content
          </a>
          <a
            className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            href="/#"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};
