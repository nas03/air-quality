import { Button } from "antd";
import React from "react";

const CTASection: React.FC = () => {
    return (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
            <div className="container mx-auto px-5 text-center">
                <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                    Bắt đầu theo dõi chất lượng không khí ngay hôm nay
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
                    Đăng ký miễn phí để nhận thông báo và dự báo chất lượng không khí
                </p>
                <Button
                    size="large"
                    className="border-none bg-white font-medium text-blue-700 shadow-md hover:bg-white/90 hover:text-blue-800 hover:shadow-lg">
                    Đăng ký ngay
                </Button>
            </div>
        </section>
    );
};

export default CTASection;
