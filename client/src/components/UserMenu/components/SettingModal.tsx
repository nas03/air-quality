import ProfileConfig from "@/components/UserMenu/components/ProfileConfig";
import SettingConfig from "@/components/UserMenu/components/SettingConfig";
import { NotificationOutlined, ProfileOutlined, SettingOutlined } from "@ant-design/icons";
import { Modal, Tabs, type TabPaneProps } from "antd";
import React from "react";
import "./menu.css";
interface IPropsSettingModal {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const SettingModal: React.FC<IPropsSettingModal> = ({ openModal, setOpenModal }) => {
  interface Tab extends Omit<TabPaneProps, "tab"> {
    key: string;
    label: React.ReactNode;
  }
  const items: Tab[] = [
    {
      key: "sub1",
      label: "Profile Settings",
      icon: <ProfileOutlined />,
      children: <ProfileConfig/>,
    },
    {
      key: "sub2",
      label: "Notifications Settings",
      icon: <NotificationOutlined />,
      children: <SettingConfig />,
    },
    {
      key: "sub4",
      label: "Others",
      icon: <SettingOutlined />,
    },
  ];
  return (
    <>
      <Modal open={openModal} onCancel={() => setOpenModal((prev) => !prev)} okText="Save Changes" className="min-w-[35rem]">
        <h2 className="mb-5 text-center text-lg font-bold">Welcome, Nguyen Anh Son</h2>
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          items={items}
          tabBarStyle={{ padding: 0 }}
          className="h-[30rem]"
        />
      </Modal>
    </>
  );
};

export default SettingModal;
