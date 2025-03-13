import { Kanit } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
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
                    {children}
                    <ToastContainer autoClose={3000} />
                </NextUIProvider>
            </body>
        </html>
    );
}