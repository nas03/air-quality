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
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const MenuItem: React.FC<IPropsMenuItem> = ({ items, selectedTab, setSelectedTab }) => {
  return (
    <>
      {items.map((item) => {
        const isSelected = selectedTab === item.key;
        if (item.type === "link")
          return (
            <Link
              to={item.path}
              key={item.key}
              className="flex w-1/3 min-w-[90px] flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50">
                {item.icon}
              </span>
              <span className="line-clamp-1 text-xs font-medium">{item.label}</span>
            </Link>
          );
        return (
          <button
            key={item.key}
            onClick={() => setSelectedTab(item.key)}
            className={cn(
              "flex w-1/3 min-w-[90px] flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors",
              isSelected ? "bg-slate-200 font-medium dark:bg-slate-700" : "hover:bg-slate-100 dark:hover:bg-slate-800",
            )}>
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md",
                isSelected
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
              )}>
              {item.icon}
            </span>
            <span className="line-clamp-1 text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </>
  );
};

const MenuDrawer: React.FC<IPropsMenuDrawer> = ({ className, open }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const items: MenuItemType[] = [
    { label: "My Alerts", key: 0, icon: <AiFillBell className="h-5 w-5" />, children: <AlertTab /> },
    { label: "My Favorites", key: 1, icon: <MdFavorite className="h-5 w-5" /> },
    {
      label: "Analytics Page",
      key: 2,
      type: "link",
      path: "/analytics",
      icon: <MdAnalytics className="h-5 w-5" />,
    },
    { label: "Profile", key: 3, icon: <AiFillProfile className="h-5 w-5" />, children: <ProfileTab /> },
    {
      label: "Settings",
      key: 4,
      icon: <IoMdSettings className="h-5 w-5" />,
      children: <SettingsTab className="mt-4 px-4" />,
    },
  ];

  // Calculate number of rows (3 items per row)
  const numberOfRows = Math.ceil(items.length / 3);
  const needsScroll = numberOfRows > 2;

  return (
    <motion.div
      animate={open ? "open" : "close"}
      variants={{
        open: {
          width: "var(--menu-width)",
          opacity: 1,
          x: 0,
        },
        close: {
          width: 0,
          opacity: 0,
          x: 20,
        },
      }}
      transition={{
        type: "spring",
        damping: 18,
        stiffness: 200,
      }}
      className={cn(
        "fixed right-0 top-0 z-40 h-full overflow-hidden border-l border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900",
        "[--menu-width:18vw] max-2xl:[--menu-width:25vw]",
        open ? "w-[18vw] max-2xl:w-[25vw]" : "w-0",
        className,
      )}>
      <div className="flex h-full flex-col">
        {/* User menu area */}
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <UserMenu className="h-full w-full" />
        </div>

        {/* Menu navigation */}
        <nav className="border-b border-slate-200 p-2 dark:border-slate-700">
          <div
            className={cn(
              "flex flex-wrap justify-center gap-y-2",
              needsScroll &&
                "scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 max-h-[140px] overflow-y-auto",
            )}>
            <MenuItem items={items} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </div>
        </nav>

        {/* Selected content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <h3 className="mb-5 border-b border-t border-slate-200 px-4 py-3 text-lg font-semibold dark:border-slate-700">
            {items[selectedTab].label}
          </h3>
          <div className="scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 flex-1 overflow-y-auto p-1">
            {items[selectedTab].children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuDrawer;
