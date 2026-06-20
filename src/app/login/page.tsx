"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-2">
                    AutoVault
                </h1>

                <p className="text-gray-500 text-center mb-6">
                    Login to continue
                </p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    className="w-full border rounded-lg p-3 mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="w-full border rounded-lg p-3 mb-6"
                />

                <button
                    onClick={() => {
                        if (
                            email === "owner@autovault.com" &&
                            password === "owner123"
                        ) {
                            localStorage.setItem("role", "owner");
                            window.location.href = "/dashboard";
                        } else if (
                            email === "staff@autovault.com" &&
                            password === "staff123"
                        ) {
                            localStorage.setItem("role", "staff");
                            window.location.href = "/dashboard";
                        } else {
                            alert("Invalid Credentials");
                        }
                    }}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg"
                >
                    Login
                </button>

            </div>

        </div>
    );
}