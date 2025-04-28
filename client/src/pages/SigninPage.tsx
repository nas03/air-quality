import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { FiAlertCircle, FiCheck } from "react-icons/fi";

interface SigninFormData {
    email: string;
    password: string;
}

const SigninForm = ({ onSubmit, loading }: { onSubmit: (data: SigninFormData) => void; loading: boolean }) => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            email: String(formData.get("email")),
            password: String(formData.get("password")),
        };
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div className="grid gap-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Mật khẩu
                    </Label>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>

            <Button
                type="submit"
                className="mt-4 flex w-full flex-row rounded-md bg-indigo-600 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                {loading && <Spin indicator={<LoadingOutlined spin className="text-white" />} className="h-full" />}
                <p>Đăng nhập</p>
            </Button>

            {/* <Button
                variant="outline"
                className="mt-2 flex w-full items-center justify-center border-gray-300 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <FcGoogle className="mr-2 h-5 w-5" />
                Đăng nhập với Google
            </Button> */}
            <div className="mt-6 text-center text-sm text-gray-500">
                Bạn chưa có tài khoản?{" "}
                <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
                    Đăng ký
                </Link>
            </div>
        </form>
    );
};

const SigninPage = () => {
    const [message, setMessage] = useState({ msg: "", isSuccess: false });
    const auth = useAuth();
    const navigate = useNavigate();
    const params: { message: string } | null = useSearch({ from: "/public/signin" });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (params && params["message"]) {
            setMessage({ msg: params.message, isSuccess: true });
        }
    }, [params]);

    const handleSignin = async (data: SigninFormData) => {
        setLoading(true);
        const status = await auth.login(data.email, data.password);
        setLoading(false);
        if (!status.success) {
            setMessage({ msg: "Email hoặc mật khẩu không đúng", isSuccess: false });
            return;
        } else if (status.success && status.message) {
            setMessage({ msg: status.message, isSuccess: false });
            return;
        }

        navigate({ to: "/" });
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
                        <SigninForm loading={loading} onSubmit={handleSignin} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SigninPage;
