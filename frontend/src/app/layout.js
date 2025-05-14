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
    other: {
        link: [
            {
                rel: 'preload',
                href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600&display=swap',
                as: 'font',
                type: 'font/woff2',
                crossOrigin: 'anonymous',
            },
        ],
    },
};

const kanit = Kanit({
    weight: ["400", "500", "600"],
    subsets: ["latin", "latin-ext", "thai"],
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