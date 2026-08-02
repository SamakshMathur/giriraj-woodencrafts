import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminModeProvider } from "@/components/AdminModeProvider";
import { OverridesProvider } from "@/components/OverridesProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getTextOverrides, getImageOverrides } from "@/lib/content";
import "./globals.css";

// Overrides are read fresh (no cache) so admin edits go live for every
// visitor immediately — this opts the whole app into dynamic rendering.
export const dynamic = "force-dynamic";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Giriraj Woodencrafts — Handcrafted Divine Spaces",
  description:
    "Every home deserves its own temple. Handcrafted wooden mandirs made with generations of craftsmanship.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [text, images] = await Promise.all([getTextOverrides(), getImageOverrides()]);

  return (
    <html lang="en" data-theme="royal-walnut">
      <body
        className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <AdminModeProvider>
            <OverridesProvider text={text} images={images}>
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </OverridesProvider>
          </AdminModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
