"use client";

import React, { useState, useRef } from "react";
import { IntlProvider, FormattedMessage } from "react-intl";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import useOutsideClick from "@/hooks/useOutsideClick";
import { Locale } from "@/lib/definitions";
import { useUser } from "@/hooks/context/AuthContext";
import { useSettings } from "@/hooks/context/ProjectSettingContext";

interface Props {
  locale: Locale;
  messages: Record<string, string>;
}

export default function NavbarContent({ locale, messages }: Props) {
  const { user } = useUser();
  const isAuthenticated = !!user;
  const role = user?.role || "";
  const { settings } = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);

  const appMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showLoader = () => {
    setLoading(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setLoading(false);
        setPercent(0);
      }
    }, 100);
  };

  const handleSignOut = async () => {
    showLoader();

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push(`/${locale}/auth/login`);
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    } finally {
      setLoading(false);
      setPercent(0);
    }
  };

  useOutsideClick(appMenuRef, () => {
    setAppMenuOpen(false);
    setIsMobileMenuOpen(false);
  });

  useOutsideClick(userMenuRef, () => {
    setUserMenuOpen(false);
  });

  const publicLinks = [
    { href: `/${locale}/index/quizHome`, label: "Quiz Home" },
    { href: `/${locale}/index/createQuiz`, label: "Create Quiz" },
    { href: `/${locale}/index/quizzesList`, label: "Quizzes List" },
  ];

  const userLinks = [
    { href: `/${locale}/index/quizHome`, label: "Quiz Home" },
    { href: `/${locale}/index/createQuiz`, label: "Create Quiz" },
    { href: `/${locale}/index/quizzesList`, label: "Quizzes List" },
    { href: `/${locale}/index/ideas`, label: "Ideas" },
    { href: `/${locale}/index/manageQuizzes`, label: "Manage Quizzes" },
    { href: `/${locale}/index/notifications`, label: "Notifications" },
  ];

  const adminLinks = [
    { href: `/${locale}/index/users`, label: "Manage Users" },
    { href: `/${locale}/index/manageQuizzes`, label: "Manage Quizzes" },
    { href: `/${locale}/index/manageWidgets`, label: "Manage Widgets" },
    { href: `/${locale}/index/subjects`, label: "Subjects" },
    { href: `/${locale}/index/settings`, label: "Settings" },
    { href: `/${locale}/index/accessLogs`, label: "Access Logs" },
    { href: `/${locale}/index/manageFeedback`, label: "Manage Feedback" },
    { href: `/${locale}/index/achievements`, label: "Achievements" },
    { href: `/${locale}/index/notifications`, label: "Notifications" },
    { href: `/${locale}/index/reports`, label: "Reports" },
    { href: `/${locale}/index/ideas`, label: "Ideas" },
  ];

  const navLinks = isAuthenticated
    ? user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? adminLinks
      : userLinks
    : publicLinks;

  return (
    <IntlProvider locale={locale} messages={messages}>
      <nav className="p-2 fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-300 shadow-md">
        <div className="flex items-center justify-between">
          {role !== "USER" ? (
            <Link href={`/${locale}/index/home`}>
              <div className="flex items-center justify-start cursor-pointer">
                <img
                  src="/images/brain-bash-logo.png"
                  alt="Ueber Pro Logo"
                  width={70}
                  height={70}
                />
                <span className="font-sansInter text-xl tracking-wide text-black font-semibold opacity-80">
                  {settings?.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-start">
              <img
                src="/images/brain-bash-logo.png"
                alt="Ueber Pro Logo"
                width={70}
                height={70}
              />
              <span className="font-sansInter text-xl tracking-wide text-black font-semibold opacity-80">
                {settings?.title}
              </span>
            </div>
          )}
          <div
            className={clsx(
              "lg:flex lg:items-center lg:justify-between lg:w-auto w-full",
              { hidden: !appMenuOpen }
            )}
            ref={appMenuRef}
          >
            <div className="lg:flex lg:flex-row lg:mt-0 lg:border-0 lg:shadow-none lg:bg-transparent flex flex-col mt-2 border-t border-gray-200 shadow-lg bg-white font-semibold font-sansInter">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:rounded-md hover:text-white hover:font-semibold ${
                      isActive
                        ? "bg-blue-500 font-semibold text-white rounded-md font-sansInter"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <button
              type="button"
              className="lg:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>

            {/* User Profile Icon */}
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    href={`/${locale}/auth/login`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    href={`/${locale}/auth/sign-up`}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    className="rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-600"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <Image
                      src="/images/navbarAvatar.png"
                      alt="Profile image"
                      className="rounded-full object-cover"
                      width={36}
                      height={36}
                    />
                  </button>

                  {userMenuOpen && (
                    <Menu ref={userMenuRef}>
                      <MenuItem href="">
                        <p className="font-semibold text-gray-800">
                          {user?.username
                            ? user.username.charAt(0).toUpperCase() +
                              user.username.slice(1)
                            : "Guest"}
                        </p>
                      </MenuItem>

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      >
                        <FormattedMessage id="common.user-menu.sign-out" />
                      </button>
                    </Menu>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={appMenuRef}
          className={clsx(
            "lg:hidden overflow-auto transition-all duration-300 ease-in-out",
            {
              "max-h-0": !isMobileMenuOpen,
              "max-h-96": isMobileMenuOpen,
            }
          )}
        >
          <div className="flex flex-col mt-2 border-t border-gray-200 shadow-lg bg-white">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-4 py-2 text-sm text-gray-700 hover:bg-blue-400 transition-colors duration-200 hover:rounded-md hover:text-white",
                    {
                      "bg-blue-500 text-white rounded-md": isActive,
                    }
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </IntlProvider>
  );
}

interface MenuProps {
  align?: "left" | "right";
  children: React.ReactNode;
  [x: string]: any;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { align = "right", children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      role="menu"
      className={clsx(
        "absolute z-10 w-48 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200",
        { "left-0": align === "left", "right-0": align === "right" }
      )}
      aria-orientation="vertical"
      tabIndex={-1}
      {...rest}
    >
      {children}
    </div>
  );
});

interface MenuItemProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

function MenuItem({ href, active, children }: MenuItemProps) {
  return (
    <Link
      href={href}
      tabIndex={-1}
      role="menuitem"
      className={clsx(
        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200",
        { "bg-gray-100": active }
      )}
    >
      {children}
    </Link>
  );
}
