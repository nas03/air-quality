import { getUserNotification } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { cn, getRelativeTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Badge, Popover } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
type NotificationContent = { aqi_index: string; recommendation: string; timestamp: string };

const NotificationBox = ({ notifications }: { notifications: NotificationContent[] }) => {
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
            {notifications.map((el, index) => (
              <div key={index} className="relative mx-auto mb-6 flex w-full max-w-full md:pt-[unset]">
                <div className="me-4 mt-1 h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex flex-row items-center gap-4 border-b-[1px] border-slate-200">
                  <div className="mb-1 grow text-justify font-medium text-zinc-950 dark:text-white">
                    <strong>Air Quality Index:</strong> {el.aqi_index} <br />
                    {el.recommendation}
                  </div>

                  <div className="flex w-[80px] flex-none items-center justify-end font-medium leading-5 text-zinc-500 dark:text-zinc-400">
                    {el.timestamp}
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
  const [notifications, setNotifications] = useState<NotificationContent[]>([]);
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["notifications", auth.user?.user_id],
    queryFn: () => getUserNotification(Number(auth.user?.user_id)),
  });

  useEffect(() => {
    const data = query.data?.map((el) => ({
      aqi_index: String(el.aqi_index) ?? "--",
      recommendation: el.recommendation,
      timestamp: getRelativeTime(el.timestamp),
    }));
    if (data) setNotifications(data);
  }, [query.isSuccess]);

  return (
    <div className={cn("", className)}>
      <Popover
        trigger={"click"}
        placement="bottomLeft"
        content={<NotificationBox notifications={notifications} />}
        overlayInnerStyle={{
          padding: 0,
        }}
      >
        <Badge
          count={notifications.length}
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
