import { useAuth } from "@/hooks/useAuth";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Avatar, Button } from "antd";
import { useEffect } from "react";
import { IPropsUserMenu } from "./types";

const UserMenu: React.FC<IPropsUserMenu> = ({ className }) => {
    const { user, logout } = useAuth();
    useEffect(() => {}, [user]);
    const renderAuthenticatedView = () => (
        <div className="flex w-full flex-row items-center justify-between gap-2">
            <Avatar size="large" icon={<UserOutlined />} src="avatar.jpg" className="cursor-default shadow-sm" />
            <button
                onClick={logout}
                className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all duration-200 hover:bg-gray-50 hover:text-blue-400">
                <LoginOutlined className="rotate-180" />
                Đăng xuất
            </button>
        </div>
    );

    const renderUnauthenticatedView = () => (
        <Link to="/signin" className="flex w-full flex-row justify-end">
            <Button
                type="default"
                className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all duration-200 hover:border-blue-400 hover:bg-gray-50 hover:text-blue-400"
                icon={<LoginOutlined />}>
                Đăng nhập
            </Button>
        </Link>
    );

    return (
        <div className={`${className} flex cursor-pointer flex-row gap-3`}>
            {user?.user_id ? renderAuthenticatedView() : renderUnauthenticatedView()}
        </div>
    );
};

export default UserMenu;
