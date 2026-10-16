import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AdminModeProvider } from "@/components/AdminModeProvider";
import { SaveStatusProvider } from "@/components/SaveStatusToast";
import "./globals.css";
import { getOverrides } from "@/lib/content";
import { registryDefault } from "@/lib/textRegistry";

// Every page reads the admin cookie (see app/template.tsx), so the whole
// app renders per request. Set here at the root so pages that can't
// declare it themselves (client pages, the 404 page) never get treated as
// static, which crashes on Cloudflare with DYNAMIC_SERVER_USAGE.
export const dynamic = "force-dynamic";

const GA_MEASUREMENT_ID = "G-2KWXVRNELM";

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

// Tab title and search description are editable (Admin > All other text).
export async function generateMetadata(): Promise<Metadata> {
  const { text } = await getOverrides();
  return {
    title: text["site-title"] ?? registryDefault("site-title"),
    description: text["site-description"] ?? registryDefault("site-description"),
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="royal-walnut" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `,
          }}
        />
        {/* Applies the visitor's saved colour theme before the page paints,
            so it doesn't flash the default theme first on every load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("girraj-theme");if(t==="royal-walnut"||t==="divine-marble"||t==="midnight-sanctum")document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${cinzel.variable} ${inter.variable} font-body antialiased`}
      >
        <ThemeProvider>
          <AdminModeProvider>
            <SaveStatusProvider>
              {children}
            </SaveStatusProvider>
          </AdminModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
