import React from "react";
import { Link } from "gatsby";
import { Menu } from "antd";

export default ({ location }: any) => {
  interface INavLinks {
    label: string;
    toPath: string;
    isRootPath?: boolean;
  }
  const NavLinks: Array<INavLinks> = [
    {
      label: "What we do",
      toPath: "/",
      isRootPath: true,
    },
    {
      label: "Pricing",
      toPath: "/pricing",
    },
    {
      label: "Book Now",
      toPath: "/book",
    },
    {
      label: "FAQ",
      toPath: "/faq",
    },
  ];

  return (
    <Menu mode="horizontal">
      {NavLinks.map((eachLink) => {
        return (
          <Menu.Item key={eachLink.label}>
            <Link
              className={`py-2 px-6 flex ${
                location.pathname.substring(1) ===
                  eachLink.label.toLowerCase() ||
                (location.pathname === "/" && eachLink.isRootPath)
                  ? "text-indigo-500 border-b-2 border-indigo-500"
                  : "flex hover:text-indigo-500"
              }`}
              to={eachLink.toPath}
            >
              {eachLink.label}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
