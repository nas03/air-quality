import React from "react";
import {
    FaBell,
    FaChartLine,
    FaMapMarkedAlt,
    FaSlidersH,
} from "react-icons/fa";

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="container mx-auto px-5">
        <div className="mb-16 text-center">
          <h2 className="mb-4 inline-block bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
            Tính năng nổi bật
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Airly cung cấp các công cụ mạnh mẽ để theo dõi và dự báo chất lượng không khí
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaChartLine className="text-xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">Dự báo chính xác</h3>
            <p className="text-gray-600">Theo dõi chất lượng không khí với độ chính xác cao trong 7 ngày liên tiếp</p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaBell className="text-xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">Hệ thống cảnh báo thông minh</h3>
            <p className="text-gray-600">Nhận thông báo kịp thời khi chất lượng không khí xuống mức nguy hiểm</p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaSlidersH className="text-xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">Giao diện tùy chỉnh linh hoạt</h3>
            <p className="text-gray-600">
              Dễ dàng điều chỉnh hiển thị các lớp dữ liệu về gió, chất lượng không khí và vị trí trạm quan trắc
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FaMapMarkedAlt className="text-xl" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-800">Phân tích dữ liệu theo khu vực</h3>
            <p className="text-gray-600">Xem và so sánh chi tiết tình trạng ô nhiễm không khí theo từng tỉnh thành</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
