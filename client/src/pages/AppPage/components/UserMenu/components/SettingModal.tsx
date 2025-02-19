import { NotificationOutlined, ProfileOutlined, SettingOutlined } from "@ant-design/icons";
import { Modal, Tabs, type TabPaneProps } from "antd";
import React from "react";
import "./menu.css";
import ProfileConfig from "./ProfileConfig";
import SettingConfig from "./SettingConfig";

interface IPropsSettingModal {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Tab extends Omit<TabPaneProps, "tab"> {
  key: string;
  label: React.ReactNode;
}

const SETTING_TABS: Tab[] = [
  {
    key: "profile",
    label: "Profile Settings",
    icon: <ProfileOutlined />,
    children: <ProfileConfig />,
  },
  {
    key: "notifications",
    label: "Notifications Settings",
    icon: <NotificationOutlined />,
    children: <SettingConfig />,
  },
  {
    key: "others",
    label: "Others",
    icon: <SettingOutlined />,
  },
];

const SettingModal: React.FC<IPropsSettingModal> = ({ openModal, setOpenModal }) => {
  const handleCancel = () => setOpenModal(false);

  return (
    <Modal open={openModal} onCancel={handleCancel} okText="Save Changes" className="min-w-[35rem]">
      <h2 className="mb-5 text-center text-lg font-bold">Welcome, Nguyen Anh Son</h2>
      <Tabs
        defaultActiveKey="profile"
        tabPosition="left"
        items={SETTING_TABS}
        tabBarStyle={{ padding: 0 }}
        className="h-[30rem]"
      />
    </Modal>
  );
};

export default SettingModal;
