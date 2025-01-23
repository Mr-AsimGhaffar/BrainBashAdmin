import { Locale } from "@/lib/definitions";
import "@/app/globals.css";
import { ConfigProvider } from "antd";
interface Props {
  params: { lang: Locale };
  children: React.ReactNode;
}

export default function Root({ params, children }: Props) {
  return (
    <html lang={params.lang}>
      <body>
        <ConfigProvider
          theme={{
            token: { colorPrimary: "#2563eb" },
          }}
        >
          <div className="">{children}</div>
        </ConfigProvider>
      </body>
    </html>
  );
}
