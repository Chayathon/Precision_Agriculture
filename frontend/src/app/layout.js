import { Kanit } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ToastWrapper from "./components/ToastWrapper";

export const metadata = {
    title: 'Precision Agriculture',
    icons: {
      icon: '/icon.png',
    },
};

const kanit = Kanit({
    subsets: ["latin", "latin-ext", "thai"],
    weight: ["400", "500", "600"],
    display: "swap",
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${kanit.className} antialiased`}
            >
                <NextUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="light">
                        {children}
                        <ToastWrapper />
                    </NextThemesProvider>
                </NextUIProvider>
            </body>
        </html>
    );
}