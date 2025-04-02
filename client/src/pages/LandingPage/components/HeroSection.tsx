import { Button } from "antd";
import React from "react";

const HeroSection: React.FC = () => {
  return (
    <header className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-800 to-indigo-900 text-white">
      <div className="absolute inset-0 z-0 bg-[url('/images/air-particles.png')] opacity-5"></div>

      <nav className="relative z-10 flex items-center justify-between px-5 py-4 lg:py-5">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Airly" className="h-9" />
        </div>
        <div className="hidden items-center space-x-8 md:flex">
          <a href="#features" className="text-sm font-medium text-white/90 transition hover:text-white">
            Tính năng
          </a>
          <a href="#benefits" className="text-sm font-medium text-white/90 transition hover:text-white">
            Lợi ích
          </a>
          <a href="#about" className="text-sm font-medium text-white/90 transition hover:text-white">
            Giới thiệu
          </a>
          <Button type="link" className="px-4 text-white hover:text-white/90">
            Đăng nhập
          </Button>
          <Button ghost className="border border-white/20 text-white hover:border-white/40 hover:bg-white/10">
            Đăng ký
          </Button>
        </div>
      </nav>

      <div className="container relative z-10 mx-auto flex h-[calc(100vh-80px)] flex-col items-center justify-between px-5 py-16 md:flex-row">
        <div className="mb-10 md:mb-0 md:max-w-lg md:pr-8">
          <h1 className="mb-4 bg-gradient-to-r from-blue-300 to-indigo-100 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
            Dự báo chất lượng không khí thông minh
          </h1>
          <p className="mb-8 text-lg text-white/90">
            Bảo vệ sức khỏe với dữ liệu chính xác trong 7 ngày tới trên toàn Việt Nam
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              type="primary"
              size="large"
              className="border-none bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md hover:shadow-lg">
              Khám phá ngay
            </Button>
            <Button ghost size="large" className="border-blue-500 text-blue-300 hover:text-blue-200">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src="/logo_no_text.svg"
            alt="Airly Air Quality Visualization"
            className="animate-float h-auto w-80 max-w-full drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]"
          />
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
