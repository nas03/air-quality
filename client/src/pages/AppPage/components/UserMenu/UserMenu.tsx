import { useAuth } from "@/hooks/useAuth";
import { LoginOutlined, MailOutlined, ProfileOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { useState } from "react";
import SettingModal from "./components/SettingModal";
import { IPropsUserMenu } from "./types";

const UserMenu: React.FC<IPropsUserMenu> = ({ className }) => {
  const { user } = useAuth();
  const [openSettingModal, setOpenSettingModal] = useState(false);

  const navigationItems: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <ProfileOutlined />,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <MailOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      label: "Settings",
      onClick: () => setOpenSettingModal((prev) => !prev),
      icon: <SettingOutlined />,
    },
  ];

  const renderAuthenticatedView = () => (
    <Dropdown menu={{ items: navigationItems }} placement="bottomLeft" trigger={["click"]}>
      <Avatar size="large" icon={<UserOutlined />} src="avatar.jpg" />
    </Dropdown>
  );

  const renderUnauthenticatedView = () => (
    <Link to="/signin">
      <Button type="default" className="rounded-3xl bg-white" icon={<LoginOutlined />} iconPosition="start">
        Sign in
      </Button>
    </Link>
  );

  return (
    <div className={`${className} flex cursor-pointer flex-row gap-3`}>
      <SettingModal openModal={openSettingModal} setOpenModal={setOpenSettingModal} />
      {user?.user_id ? renderAuthenticatedView() : renderUnauthenticatedView()}
    </div>
  );
};

export default UserMenu;
