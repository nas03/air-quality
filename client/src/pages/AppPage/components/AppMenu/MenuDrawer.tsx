import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiFillBell, AiFillProfile } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { MdFavorite } from "react-icons/md";
import UserMenu from "../UserMenu/UserMenu";
import NotificationTab from "./NotificationTab";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";
interface IPropsMenuDrawer extends React.ComponentPropsWithoutRef<"div"> {
  open: boolean;
}
const MenuDrawer: React.FC<IPropsMenuDrawer> = ({ className, open }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const items = [
    { label: "Notifications", key: 0, icon: <AiFillBell size={35} className="p-2" />, children: <NotificationTab /> },
    { label: "My Favorites", key: 1, icon: <MdFavorite size={35} className="p-2" /> },
    { label: "Profile", key: 2, icon: <AiFillProfile size={35} className="p-2" />, children: <ProfileTab /> },
    {
      label: "Settings",
      key: 3,
      icon: <IoMdSettings size={35} className="p-2" />,
      children: <SettingsTab className="mt-6 px-6" />,
    },
  ];
  return (
    <>
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-0 transition-all duration-500",
          open ? "w-[18vw]" : "w-0",
          className,
        )}>
        <div className="flex w-full flex-row items-end justify-between px-10 pt-[1rem]">
          <p className="line-clamp-1 text-base font-extrabold uppercase text-zinc-950 dark:text-white md:text-xl">
            Hello, Nguyen Anh Son
          </p>
          <UserMenu className="" />
        </div>
        <div className="mt-8 flex w-full items-center justify-center">
          <div
            className={cn(
              "flex w-[80%] flex-row overflow-x-clip rounded-md transition-all",
              open ? "border-2 border-slate-500 p-3" : "border-none",
            )}>
            <div className="flex flex-1 flex-col gap-2">
              {items.slice(0, Math.ceil(items.length / 2)).map((item, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedTab(item.key)}
                  className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-blue-400 hover:underline">
                  {item.icon}
                  <p className="line-clamp-1">{item.label}</p>
                </span>
              ))}
            </div>
            <div className="flex flex-grow-0 flex-col gap-2">
              {items.slice(Math.ceil(items.length / 2)).map((item, index) => (
                <span
                  key={index}
                  onClick={() => setSelectedTab(item.key)}
                  className="flex flex-row items-center gap-1 hover:cursor-pointer hover:text-blue-400 hover:underline">
                  {item.icon}
                  <p className="line-clamp-1">{item.label}</p>
                </span>
              ))}
            </div>
          </div>
        </div>
        <h3 className="mt-10 px-5 text-base font-extrabold text-zinc-950 dark:text-white md:text-2xl">
          {items[selectedTab].label}
        </h3>
        <div className="scrollbar h-[80%] w-full overflow-y-auto">{items[selectedTab].children}</div>
      </div>
    </>
  );
};

export default MenuDrawer;
