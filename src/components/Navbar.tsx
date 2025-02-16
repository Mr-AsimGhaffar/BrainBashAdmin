import NavbarContent from "@/components/NavbarContent";

import { Locale } from "@/lib/definitions";

async function getMessages(locale: string) {
  return (await import(`../lang/${locale}.json`)).default;
}

interface Props {
  locale: Locale;
}

export default async function Navbar({ locale }: Props) {
  const messages = await getMessages(locale);

  return <NavbarContent locale={locale} messages={messages} />;
}
