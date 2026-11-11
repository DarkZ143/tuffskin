import type { Metadata } from "next";
import SiteTransition from "./components/site-transition";
import "./globals.css";
import "./components/loader.css";

export const metadata: Metadata = {
  title: "TuffSkin Houston | Mirador Stoneworks",
  description:
    "Protect Houston's finest marble, quartzite, onyx, and travertine with TuffSkin surface protection, installed by Mirador Stoneworks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <SiteTransition>{children}</SiteTransition>
      </body>
    </html>
  );
}
