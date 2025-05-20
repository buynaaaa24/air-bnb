import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";
import Navbar from "./components/navbar/Navbar"; 
import ClientOnly from "./components/ClientOnly";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/searchModal";

export const metadata: Metadata = {
  title: "MUST State",
  description: "Diplomiin ajil",
};

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body
        className={font.className}
        style={{
          background: "white",
          backgroundImage: "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
          minHeight: "100vh",
        }}
      >
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <RegisterModal />
          <LoginModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className="pb-20 pt-28">
          {children}
        </div>
        <footer className="w-full text-center py-4 text-sm text-neutral-600 border-t mt-8">
          Бичсэн: Ариунбуян © 2025
        </footer>
      </body>
    </html>
  );
}
