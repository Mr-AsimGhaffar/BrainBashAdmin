import { ConfigProvider } from "antd";
import Navbar from "@/components/Navbar";
import Content from "@/components/Content";

import { getProjectSettings, getUser } from "@/lib/data";
import { Locale } from "@/lib/definitions";
import { UserProvider } from "@/hooks/context/AuthContext";
import { headers } from "next/headers";
import { Inter, Work_Sans, Montserrat } from "next/font/google";

import "@/app/globals.css";
import { NotificationProvider } from "@/hooks/context/NotificationContext";
import { SettingsProvider } from "@/hooks/context/ProjectSettingContext";

export const metadata = {
  title: "BrainBash Admin",
  icons: {
    icon: "/images/brain-bash-logo.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-workSans",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

interface Props {
  params: { lang: Locale };
  children: React.ReactNode;
}

export default async function Root({ params, children }: Props) {
  const headerList = headers();
  const pathname: string = headerList.get("x-current-path") || "";
  const user = await getUser();
  const projectSettings = await getProjectSettings();
  const isAuthPage =
    params.lang &&
    ["login", "register"].some((route) => pathname.includes(route));

  return (
    <html
      lang={params.lang}
      className={`${inter.variable} ${workSans.variable} ${montserrat.variable}`}
    >
      <body className="relative mt-16">
        <ConfigProvider
          theme={{
            token: { colorPrimary: "#2563eb" },
          }}
        >
          <UserProvider initialUser={user}>
            <SettingsProvider initialSettings={projectSettings}>
              <NotificationProvider>
                {!isAuthPage && (
                  <>
                    <Navbar locale={params.lang} />
                  </>
                )}
                {isAuthPage ? children : <Content>{children}</Content>}
              </NotificationProvider>
            </SettingsProvider>
          </UserProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
