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
      toPath: "/booking",
    },
    {
      label: "FAQ",
      toPath: "/faq",
    },
  ];
  const renderUserControls = function () {
    if (typeof window === "undefined") {
      return;
    }
    const idToken = localStorage.getItem("idToken");
    //if idToken is expired or does not exist
    if (!idToken) {
      return (
        <Menu.Item
          style={{ marginLeft: "auto" }}
          onClick={() => {
            window.location.href = `https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:8000/login/callback/`;
          }}
        >
          Login/Signup
        </Menu.Item>
      );
    } else {
      //user icon with email?
      return 
    }
  };
  return (
    <Menu mode="horizontal" style={{ display: "flex" }}>
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
      {renderUserControls()}
    </Menu>
  );
};
