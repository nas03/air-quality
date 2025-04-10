import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-5 pb-8 pt-16">
                <div className="mb-10">
                    <img src="/logo.svg" alt="Airly" className="h-9" />
                </div>

                <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div>
                        <h4 className="mb-4 font-semibold text-gray-300">Sản phẩm</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Tính năng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Dự báo
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Báo cáo
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-gray-300">Công ty</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Về chúng tôi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Liên hệ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Đối tác
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-gray-300">Hỗ trợ</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Hướng dẫn
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Trung tâm trợ giúp
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-gray-300">Pháp lý</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Điều khoản sử dụng
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 transition hover:text-blue-400">
                                    Chính sách bảo mật
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
                    <p className="mb-4 text-sm text-gray-500 md:mb-0">
                        &copy; {new Date().getFullYear()} Airly. Tất cả các quyền được bảo lưu.
                    </p>
                    <div className="flex space-x-4">
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-blue-600 hover:text-white">
                            <FaFacebookF size={16} />
                        </a>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-blue-400 hover:text-white">
                            <FaTwitter size={16} />
                        </a>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-pink-600 hover:text-white">
                            <FaInstagram size={16} />
                        </a>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-blue-700 hover:text-white">
                            <FaLinkedinIn size={16} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
