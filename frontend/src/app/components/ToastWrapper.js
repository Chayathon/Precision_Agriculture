"use client";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Kanit } from "next/font/google";

const kanit = Kanit({
    subsets: ["latin", "latin-ext", "thai"],
    weight: ["400", "500", "600"],
    display: "swap",
});

function ToastWrapper() {
    const { theme } = useTheme();

    return (
        <ToastContainer
            theme={theme === "dark" ? "dark" : "light"}
            toastClassName={kanit.className}
            bodyClassName={kanit.className}
            autoClose={3000}
        />
    );
};

export default ToastWrapper;