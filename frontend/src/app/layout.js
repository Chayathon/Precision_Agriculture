import { Kanit } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
    title: 'Precision Agriculture',
    icons: {
      icon: '/favicon.ico',
    },
};

const kanit = Kanit({
    weight: ["400", "500", "600"],
    subsets: ["latin-ext", "thai"],
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
                        <ToastContainer autoClose={3000} />
                    </NextThemesProvider>
                </NextUIProvider>
            </body>
        </html>
    );
}