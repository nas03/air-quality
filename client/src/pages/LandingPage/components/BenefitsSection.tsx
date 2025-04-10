import React from "react";

const BenefitsSection: React.FC = () => {
    return (
        <section id="benefits" className="bg-white py-20">
            <div className="container mx-auto px-5">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 inline-block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                        Lợi ích sử dụng
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-600">
                        Airly giúp bạn có cuộc sống tốt đẹp hơn thông qua dữ liệu chất lượng không khí
                    </p>
                </div>

                <div className="flex flex-col items-center gap-12 lg:flex-row">
                    <div className="lg:w-1/2">
                        <img
                            src="/images/health-protection.jpg"
                            alt="Bảo vệ sức khỏe"
                            className="h-auto w-full rounded-lg shadow-md"
                        />
                    </div>

                    <div className="space-y-8 lg:w-1/2">
                        <div className="border-l-4 border-blue-600 pl-6">
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Chủ động bảo vệ sức khỏe</h3>
                            <p className="text-gray-600">
                                Dự báo chất lượng không khí giúp bạn chủ động bảo vệ sức khỏe bản thân và gia đình
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-600 pl-6">
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">
                                Lập kế hoạch hoạt động hiệu quả
                            </h3>
                            <p className="text-gray-600">
                                Dễ dàng lên lịch cho các hoạt động ngoài trời dựa trên dự báo chất lượng không khí
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-600 pl-6">
                            <h3 className="mb-2 text-xl font-semibold text-gray-800">Dữ liệu khoa học dễ hiểu</h3>
                            <p className="text-gray-600">
                                Tiếp cận dữ liệu khoa học chính xác về môi trường không khí qua giao diện trực quan
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
