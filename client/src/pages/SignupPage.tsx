import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { createUser } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "antd";
import { MdErrorOutline } from "react-icons/md";

interface SignupFormData {
    username: string;
    email: string;
    phone_number: string;
    password: string;
}

const SignupForm = ({ onSubmit }: { onSubmit: (data: SignupFormData) => Promise<void> }) => {
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordError(null);
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const password = String(data.password);
        const retypePassword = String(data.retype_password);

        if (password !== retypePassword) {
            setPasswordError("Mật khẩu nhập lại không khớp.");
            return;
        }

        await onSubmit({
            username: String(data.username),
            email: String(data.email),
            phone_number: String(data.phone_number),
            password: password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {passwordError && (
                <Alert description={passwordError} type="error" showIcon icon={<MdErrorOutline />} className="mt-2" />
            )}
            <div className="grid gap-3">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Tên đăng nhập
                </Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                </Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Số điện thoại
                </Label>
                <Input
                    id="phone"
                    name="phone_number"
                    type="tel"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mật khẩu
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="retype_password" className="text-sm font-medium text-gray-700">
                    Nhập lại mật khẩu
                </Label>
                <Input
                    id="retype_password"
                    name="retype_password"
                    type="password"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <Button
                type="submit"
                className="mt-4 w-full rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                Tạo tài khoản
            </Button>
            <Button
                variant="outline"
                type="button"
                className="mt-2 flex w-full items-center justify-center border-gray-300 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <FcGoogle className="mr-2 h-5 w-5" />
                Đăng ký với Google
            </Button>
            <div className="mt-6 text-center text-sm text-gray-500">
                Đã có tài khoản?{" "}
                <Link to="/signin" className="font-medium text-indigo-600 hover:underline">
                    Đăng nhập
                </Link>
            </div>
        </form>
    );
};

const SignupPage = () => {
    const navigate = useNavigate();

    const handleSignup = async (data: SignupFormData) => {
        try {
            await createUser(data);
            navigate({
                to: "/signin",
                search: {
                    message: "Vui lòng kiểm tra email để kích hoạt tài khoản",
                },
            });
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-6 md:p-10">
            <div className="w-full max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="rounded-t-md bg-gradient-to-r from-[#003366] to-[#1a237e] py-6 text-center text-white">
                        <Link to="/" className="inline-block">
                            <CardTitle className="flex flex-row items-center justify-center gap-3 text-2xl text-white transition-opacity hover:opacity-90">
                                <img src="/logo_no_text.svg" alt="logo" className="h-8 w-auto" />
                                <p>Airly</p>
                            </CardTitle>
                            <CardDescription className="mt-3 text-sm text-gray-200">
                                Hệ thống Dự báo Chất lượng Không khí
                            </CardDescription>
                        </Link>
                    </CardHeader>
                    <CardContent className="rounded-b-md bg-white p-6">
                        <SignupForm onSubmit={handleSignup} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignupPage;
