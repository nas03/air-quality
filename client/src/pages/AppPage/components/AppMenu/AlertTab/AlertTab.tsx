import { getUserNotification, getUserSetting } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { getRelativeTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import AlertBox from "./AlertBox";
import AlertRegistration from "./AlertRegistration";
import SignInNotification from "./SignInNotification";
import { AlertContent } from "./types";

interface AlertTabProps extends React.ComponentPropsWithoutRef<"div"> {}

const LoadingAlert = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <p>Loading alerts...</p>
    </div>
  </div>
);

const LoadingFailed = () => (
  <div className="flex h-full items-center justify-center">
    <p className="text-red-500">Failed to load alerts</p>
  </div>
);

const AlertTab: React.FC<AlertTabProps> = () => {
  const [alerts, setAlerts] = useState<AlertContent[]>([]);
  const [refetchNotification, setRefetchNotification] = useState(false);
  const { user } = useAuth();
  const userId = user?.user_id ? Number(user.user_id) : undefined;

  const { data: userSettingData, refetch: refetchUserSettings } = useQuery({
    queryKey: ["setting", userId],
    queryFn: () => getUserSetting(userId as number),
    enabled: !!userId,
  });

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    isError: isNotificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["alerts", userId],
    queryFn: () => getUserNotification(userId as number),
    enabled: !!userId && !!userSettingData?.user_id,
  });

  useEffect(() => {
    if (refetchNotification) {
      refetchNotifications();
      refetchUserSettings();
      setRefetchNotification(false);
    }
  }, [refetchNotification, refetchNotifications, refetchUserSettings]);

  useEffect(() => {
    if (!notificationsData) return;

    const formattedAlerts = notificationsData.map((notification) => ({
      aqi_index: String(notification.aqi_index) ?? "--",
      recommendation: notification.en_recommendation,
      timestamp: getRelativeTime(notification.timestamp),
    }));

    setAlerts(formattedAlerts);
  }, [notificationsData]);

  const renderContent = () => {
    if (!user) {
      return <SignInNotification />;
    }

    if (!userSettingData) {
      return <AlertRegistration setRefetchNotification={setRefetchNotification} />;
    }

    if (isNotificationsLoading) {
      return <LoadingAlert />;
    }

    if (isNotificationsError) {
      return <LoadingFailed />;
    }

    return <AlertBox alerts={alerts} />;
  };

  return (
    <div className="relative flex h-full w-full flex-col pt-[20px] md:pt-0">
      {user && (
        <div className="flex items-end justify-end px-6 text-blue-500">
          <div className="cursor-pointer hover:underline hover:underline-offset-1">All Alerts</div>
        </div>
      )}
      <div className="scrollbar mb-3 mt-5 h-full overflow-y-auto px-6" style={{ msScrollbarTrackColor: "white" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AlertTab;
