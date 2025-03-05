import { cn } from "@/lib/utils";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { motion } from 'motion/react';
import React from "react";
interface IPropsAppMenu extends React.ComponentPropsWithoutRef<"div"> {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppMenu: React.FC<IPropsAppMenu> = ({ className, openDrawer, setOpenDrawer }) => {
  return (
    <>
      <motion.div className={cn("", className)}>
        {openDrawer ? (
          <CloseOutlined className="rounded-full bg-white p-3" onClick={() => setOpenDrawer((prev) => !prev)} />
        ) : (
          <motion.div className="flex flex-row items-center gap-0 p-0">
            <span
              className={cn(
                "z-10 translate-x-2 rounded-l-2xl bg-blue-600 px-3 py-1 text-xl font-semibold uppercase text-white",
              )}>
              Menu
            </span>
            <MenuOutlined
              className="z-20 rounded-full bg-white p-3 text-xl"
              onClick={() => setOpenDrawer((prev) => !prev)}
            />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default AppMenu;
