import { cn } from "@/lib/utils";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import React from "react";

interface IPropsAppMenu extends React.ComponentPropsWithoutRef<"div"> {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppMenu: React.FC<IPropsAppMenu> = ({ className, openDrawer, setOpenDrawer }) => {
  return (
    <>
      <div className={cn("", className)}>
        {openDrawer ? (
          <CloseOutlined className="rounded-full bg-white p-3" onClick={() => setOpenDrawer((prev) => !prev)} />
        ) : (
          <MenuOutlined className="rounded-full bg-white p-3" onClick={() => setOpenDrawer((prev) => !prev)} />
        )}
      </div>
    </>
  );
};

export default AppMenu;
