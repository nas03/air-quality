import { getUserNotification } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { getRelativeTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface IPropsNotificationTab extends React.ComponentPropsWithoutRef<"div"> {}
type NotificationContent = { aqi_index: string; recommendation: string; timestamp: string };
const NotificationBox = ({ notifications }: { notifications: NotificationContent[] }) => {
  return (
    <>
      <div className="relative flex h-full w-full flex-col pt-[20px] md:pt-0">
        <div className="flex items-end justify-end px-6 text-blue-500">
          <div className="cursor-pointer hover:underline hover:underline-offset-1">All Notifications</div>
        </div>
        <div
          className="scrollbar mb-3 mt-5 h-full overflow-y-auto px-6"
          style={{
            msScrollbarTrackColor: "white",
          }}>
          {Array(50)
            .fill(notifications[0])
            .map((el, index) => (
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
      </div>
    </>
  );
};
const NotificationTab: React.FC<IPropsNotificationTab> = () => {
  const [notifications, setNotifications] = useState<NotificationContent[]>([]);
  const auth = useAuth();
  const query = useQuery({
    queryKey: ["notifications", auth.user?.user_id],
    queryFn: () => getUserNotification(Number(auth.user?.user_id)),
  });

  useEffect(() => {
    const data = query.data?.map((el) => ({
      aqi_index: String(el.aqi_index) ?? "--",
      recommendation: el.en_recommendation,
      timestamp: getRelativeTime(el.timestamp),
    }));
    if (data) setNotifications(data);
  }, [query.isSuccess]);
  return (
    <>
      {query.isLoading ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <p>Loading notifications...</p>
          </div>
        </div>
      ) : query.isError ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">Failed to load notifications</p>
        </div>
      ) : (
        <NotificationBox
          notifications={
            notifications.length
              ? notifications
              : [{ aqi_index: "--", recommendation: "No notifications yet", timestamp: "" }]
          }
        />
      )}
    </>
  );
};
export default NotificationTab;
