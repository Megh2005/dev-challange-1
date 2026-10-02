import type { Metadata, Viewport } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { MobileNav } from "@/components/navigation/MobileNav";
import SessionProvider from "@/components/providers/SessionProvider";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "ShramPark",
  description:
    "ShramPark is a mobile-first digital learning platform for on-site construction workers bridging engineering standards and practical execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoSlab.className}>
      <body className={`${robotoSlab.className} bg-white text-[#181A1E] min-h-screen antialiased flex flex-col selection:bg-[#F06529]/20 selection:text-[#F06529]`}>
        <SessionProvider>
          <MobileNav />

          <div className="flex-1 flex flex-col items-center w-full">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
