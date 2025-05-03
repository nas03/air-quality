import { Loading } from "@/components";
import api from "@/config/api";
import { useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const CodeVerificationPage = () => {
    const searchParams: { code: string } | null = useSearch({ from: "/sub/verification" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams && searchParams.code) {
            setLoading(true);
            api.post(`/auth/verification/${searchParams.code}`).then(() => setLoading(false));
        }
    }, [searchParams]);

    return (
        <Loading loading={loading} className="h-screen bg-gray-50">
            <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
                    <div className="mb-4 flex justify-center">
                        <img src="/logo_no_text.svg" alt="Logo" className="h-16 w-auto" />
                    </div>
                    <h1 className="mb-2 text-center text-2xl font-bold text-blue-700">
                        Tài khoản của bạn đã được kích hoạt!
                    </h1>
                    <p className="mb-4 text-center text-gray-600">
                        Cảm ơn bạn đã xác nhận email. Bạn có thể bắt đầu sử dụng hệ thống giám sát chất lượng không khí
                        ngay bây giờ.
                    </p>
                    <div className="text-center">
                        <a
                            href="/"
                            className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                            Quay lại Trang Chủ
                        </a>
                    </div>
                </div>
            </div>
        </Loading>
    );
};

export default CodeVerificationPage;
