import React from "react";

const AboutSection: React.FC = () => {
    return (
        <section id="about" className="bg-gray-50 py-20">
            <div className="container mx-auto px-5">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 inline-block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                        Về Airly
                    </h2>
                </div>

                <div className="flex flex-col-reverse items-center gap-12 lg:flex-row">
                    <div className="space-y-4 lg:w-1/2">
                        <p className="text-lg text-gray-600">
                            Airly là giải pháp tiên tiến giúp dự báo chính xác chất lượng không khí dựa trên chỉ số
                            PM2.5 cho toàn bộ lãnh thổ Việt Nam.
                        </p>
                        <p className="text-lg text-gray-600">
                            Sử dụng công nghệ trí tuệ nhân tạo hiện đại, Airly cung cấp dự báo chi tiết trong 7 ngày tới
                            với độ phân giải cao 1km trên mọi tỉnh thành đất liền của Việt Nam.
                        </p>
                    </div>

                    <div className="lg:w-1/2">
                        <img
                            src="/images/vietnam-map.jpg"
                            alt="Bản đồ dự báo không khí Việt Nam"
                            className="h-auto w-full rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
