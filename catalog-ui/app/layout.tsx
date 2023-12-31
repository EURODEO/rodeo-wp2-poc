import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "./Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discovery Metadata catalog",
  description: "Discovery Metadata catalog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-zinc-100 dark:bg-black"}>
        <div className="flex justify-center">
          <div className="min-h-screen w-screen md:w-[768px] lg:w-[1024px] xl:w-[1280px] flex flex-col">
            <Navbar />
            <div className="grow">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
