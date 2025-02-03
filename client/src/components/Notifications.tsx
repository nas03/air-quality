import { cn } from "@/lib/utils";
import { Badge, Popover } from "antd";
import { AiOutlineBell } from "react-icons/ai";

const NotificationBox = () => {
  return (
    <>
      <div className="relative flex w-[25rem] flex-col pt-[20px] md:pt-0">
        <div className="mb-5 mr-0 h-min max-w-full rounded-lg border bg-card pb-6 pt-8 text-card-foreground shadow-sm dark:border-zinc-800 md:mb-0">
          <div className="px-6">
            <p className="text-base font-extrabold text-zinc-950 dark:text-white md:text-2xl">Notifications</p>
          </div>
          <div
            className="scrollbar mb-3 mt-5 h-[20rem] overflow-y-auto px-6"
            style={{
              msScrollbarTrackColor: "white",
            }}
          >
            {Array(10)
              .fill(" Air Quality Alert: PM2.5 levels exceeding safety limits")
              .map((el, index) => (
                <div key={index} className="relative mx-auto mb-6 flex w-full max-w-full md:pt-[unset]">
                  <div className="me-4 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex flex-row items-center gap-4 border-b-[1px] border-slate-200">
                    <div className="mb-1 grow font-medium text-zinc-950 dark:text-white">{el}</div>
                    <div className="flex w-[90px] flex-none items-center justify-end font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                      1 hour ago
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-end px-6 text-blue-500">
            <div className="cursor-pointer hover:underline hover:underline-offset-1">All Notifications</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Notifications = ({ className }: React.ComponentPropsWithoutRef<"div">) => {
  const contents = Array(50).fill("This is the content");

  return (
    <div className={cn("", className)}>
      <Popover
        trigger={"click"}
        placement="bottomLeft"
        content={NotificationBox}
        overlayInnerStyle={{
          padding: 0,
        }}
      >
        <Badge
          count={contents.length}
          onClick={() => console.log("show notification")}
          className="cursor-pointer hover:opacity-80"
        >
          <AiOutlineBell size={35} className="rounded-full bg-white p-2" />
        </Badge>
      </Popover>
    </div>
  );
};

export default Notifications;
