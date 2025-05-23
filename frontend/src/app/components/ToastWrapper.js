"use client";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ToastWrapper() {
    const { theme } = useTheme();

    return (
        <ToastContainer
            theme={theme === "dark" ? "dark" : "light"}
            autoClose={3000}
        />
    );
};

export default ToastWrapper;