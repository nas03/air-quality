import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";

import { createUser } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiAlertCircle, FiCheck } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";

interface SignupFormData {
    username: string;
    email: string;
    phone_number: string;
    password: string;
}

const SignupForm = ({ onSubmit }: { onSubmit: (data: SignupFormData) => Promise<void> }) => {
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (value.length < 8) {
            setPasswordError("Mật khẩu phải có ít nhất 8 ký tự.");
        } else {
            setPasswordError(null);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneNumber(value);

        if (value.length !== 9) {
            setPhoneError("Số điện thoại không hợp lệ");
        } else {
            setPhoneError(null);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setPasswordError(null);
        setPhoneError(null);
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const password = String(data.password);
        const retypePassword = String(data.retype_password);
        const phone = String(data.phone_number);

        if (password.length < 8) {
            setPasswordError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }

        if (password !== retypePassword) {
            setPasswordError("Mật khẩu nhập lại không khớp.");
            return;
        }

        if (phone.length !== 9) {
            setPhoneError("Số điện thoại không hợp lệ");
            return;
        }

        onSubmit({
            username: String(data.full_name),
            email: String(data.email),
            phone_number: phone,
            password: password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Tên người dùng
                </Label>
                <Input
                    id="full_name"
                    name="full_name"
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
                <div className="flex">
                    <div className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                        +84
                    </div>
                    <Input
                        id="phone"
                        name="phone_number"
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className={`rounded-l-none rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                            phoneError ? "border-red-500" : ""
                        }`}
                        placeholder="123456789"
                    />
                </div>
                {phoneError && (
                    <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <MdErrorOutline /> {phoneError}
                    </span>
                )}
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
                    value={password}
                    onChange={handlePasswordChange}
                    className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                        passwordError ? "border-red-500" : ""
                    }`}
                />
                {passwordError && (
                    <span className="mt-1 flex items-center gap-1 text-xs text-red-600">
                        <MdErrorOutline /> {passwordError}
                    </span>
                )}
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
            {/*   <Button
                variant="outline"
                type="button"
                className="mt-2 flex w-full items-center justify-center border-gray-300 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <FcGoogle className="mr-2 h-5 w-5" />
                Đăng ký với Google
            </Button> */}
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
    const [message, setMessage] = useState({ msg: "", isSuccess: false });

    const handleSignup = async (data: SignupFormData) => {
        const response = await createUser(data);

        if (response.isSuccess) {
            setMessage({ msg: "Đăng ký tài khoản thành công", isSuccess: true });
            return navigate({
                to: "/signin",
                search: {
                    message: "Vui lòng kiểm tra email để kích hoạt tài khoản",
                },
            });
        }
        return setMessage({ msg: response.message, isSuccess: false });
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
                        {message.msg && (
                            <div
                                className={`animate-fadeIn mb-4 w-full overflow-hidden rounded-md border ${
                                    message.isSuccess
                                        ? "border-green-200 bg-gradient-to-r from-green-50 to-green-100 text-green-700"
                                        : "border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-700"
                                } p-3 shadow-inner`}>
                                <div className="flex items-center">
                                    <div
                                        className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                            message.isSuccess ? "bg-green-200" : "bg-red-200"
                                        }`}>
                                        {message.isSuccess ? (
                                            <FiCheck className="h-5 w-5" />
                                        ) : (
                                            <FiAlertCircle className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        {message && <p className="break-words text-sm opacity-80">{message.msg}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                        <SignupForm onSubmit={handleSignup} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignupPage;
