import SettingModal from "@/components/UserMenu/components/SettingModal";
import { IPropsUserMenu } from "@/components/UserMenu/types";
import { useAuth } from "@/hooks/useAuth";
import { LoginOutlined, MailOutlined, ProfileOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { useState } from "react";

const UserMenu: React.FC<IPropsUserMenu> = (props) => {
  const auth = useAuth();
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const btns = [
    {
      label: "Sign in",
      url: "/signin",
    },
  ];

  const items: MenuProps["items"] = [
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
  return (
    <>
      <div className={`${props.className} flex flex-row gap-3`}>
        <SettingModal openModal={openSettingModal} setOpenModal={setOpenSettingModal} />
        {auth.user?.user_id ? (
          <>
            <Dropdown menu={{ items }} placement="bottomLeft" trigger={["click"]}>
              <Avatar size={"large"} icon={<UserOutlined />} src="avatar.jpg" />
            </Dropdown>
          </>
        ) : (
          btns.map((btn) => (
            <Link key={btn.url} to={btn.url}>
              <Button type="default" className="rounded-3xl bg-white" icon={<LoginOutlined />} iconPosition={"start"}>
                {btn.label}
              </Button>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default UserMenu;
