import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import React, { useState } from "react";
import { AiFillBell, AiFillProfile } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { MdAnalytics, MdFavorite } from "react-icons/md";
import UserMenu from "../UserMenu/UserMenu";
import AlertTab from "./AlertTab/AlertTab";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";
type MenuItemType = {
  label: string;
  key: number;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  type?: "menu" | "link";
  path?: string;
};
interface IPropsMenuDrawer extends React.ComponentPropsWithoutRef<"div"> {
  open: boolean;
}
interface IPropsMenuItem {
  items: MenuItemType[];
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}
const MenuItem: React.FC<IPropsMenuItem> = ({ items, setSelectedTab }) => {
  return (
    <>
      {items.map((item, index) => {
        if (item.type === "link")
          return (
            <Link
              to={item.path}
              key={index}
              className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-blue-400 hover:underline">
              {item.icon}
              <p className="line-clamp-1">{item.label}</p>
            </Link>
          );
        return (
          <span
            key={index}
            onClick={() => setSelectedTab(item.key)}
            className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-blue-400 hover:underline">
            {item.icon}
            <p className="line-clamp-1">{item.label}</p>
          </span>
        );
      })}
    </>
  );
};
const MenuDrawer: React.FC<IPropsMenuDrawer> = ({ className, open }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const items: MenuItemType[] = [
    { label: "My Alerts", key: 0, icon: <AiFillBell size={35} className="p-2" />, children: <AlertTab /> },
    { label: "My Favorites", key: 1, icon: <MdFavorite size={35} className="p-2" /> },
    {
      label: "Analytics Page",
      key: 2,
      type: "link",
      path: "/analytics",
      icon: <MdAnalytics size={35} className="p-2" />,
    },
    { label: "Profile", key: 3, icon: <AiFillProfile size={35} className="p-2" />, children: <ProfileTab /> },
    {
      label: "Settings",
      key: 4,
      icon: <IoMdSettings size={35} className="p-2" />,
      children: <SettingsTab className="mt-6 px-6" />,
    },
  ];
  return (
    <>
      <motion.div
        animate={open ? "open" : "close"}
        variants={{
          open: {
            width: "var(--menu-width)",
            opacity: 100,
          },
          close: { width: 0, opacity: 0 },
        }}
        transition={{
          type: "tween",
          duration: 0.3,
        }}
        className={cn(
          "fixed right-0 top-0 h-full [--menu-width:18vw] max-2xl:[--menu-width:25vw]",
          open ? "w-[18vw] max-2xl:w-[25vw]" : "w-0",
          className,
        )}>
        <div className="flex w-full flex-row items-end justify-between px-10 pt-[1rem]">
          <UserMenu className="h-full w-full" />
        </div>
        <div className="mt-8 flex w-full items-center justify-center">
          <div
            className={cn(
              "flex w-[80%] flex-row overflow-x-clip rounded-md transition-all",
              open ? "border-2 border-slate-500 p-3" : "border-none",
            )}>
            <div className="flex flex-1 flex-col gap-2">
              <MenuItem items={items.slice(0, Math.ceil(items.length / 2))} setSelectedTab={setSelectedTab} />
            </div>
            <div className="flex flex-grow-0 flex-col gap-2">
              <MenuItem items={items.slice(Math.ceil(items.length / 2))} setSelectedTab={setSelectedTab} />
            </div>
          </div>
        </div>
        <h3 className="mt-10 px-5 text-base font-extrabold text-zinc-950 dark:text-white md:text-2xl">
          {items[selectedTab].label}
        </h3>
        <div className="scrollbar h-[80%] w-full min-w-[18vw] overflow-y-auto overflow-x-hidden">
          {items[selectedTab].children}
        </div>
      </motion.div>
    </>
  );
};

export default MenuDrawer;
