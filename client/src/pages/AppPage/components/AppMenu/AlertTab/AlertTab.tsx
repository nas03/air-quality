import { getUserAlertSetting } from "@/api/alertSetting";
import { Loading } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import AlertInfoCards from "./AlertInfoCard";
import AlertRegistration from "./AlertRegistration";
import SignInNotification from "./SignInNotification";

interface AlertTabProps extends React.ComponentPropsWithoutRef<"div"> {}

const AlertTab: React.FC<AlertTabProps> = () => {
    const [addAlert, setAddAlert] = useState(false);
    const [refetchNotification, setRefetchNotification] = useState(false);
    const { user } = useAuth();
    const userId = user?.user_id ? Number(user.user_id) : undefined;

    const {
        data: alertSettingData = [],
        refetch: refetchAlertSetting,
        isLoading,
    } = useQuery<any[]>({
        queryKey: ["alert_setting", userId],
        queryFn: () => getUserAlertSetting(userId as number),
        enabled: !!userId,
    });

    useEffect(() => {
        if (refetchNotification) {
            refetchAlertSetting();
            setRefetchNotification(false);
        }
    }, [refetchNotification, refetchAlertSetting]);

    const renderContent = () => {
        if (!user) {
            return <SignInNotification />;
        }

        if (addAlert) {
            return (
                <AlertRegistration
                    setAddAlert={setAddAlert}
                    setRefetchNotification={setRefetchNotification}
                    alertSettingData={alertSettingData}
                />
            );
        }

        return <AlertInfoCards alertSettingData={alertSettingData} />;
    };

    return (
        <Loading loading={isLoading} className="relative flex h-full w-full flex-col pt-[20px] md:pt-0">
            {user && (
                <div className="flex items-end justify-end px-6">
                    <button
                        onClick={() => setAddAlert(true)}
                        className="flex items-center gap-1.5 rounded-md border border-blue-500 bg-white px-3 py-1.5 text-sm font-medium text-blue-500 shadow-sm transition hover:bg-blue-50 active:bg-blue-100">
                        <FiPlus className="h-4 w-4" />
                        Thêm Cảnh Báo
                    </button>
                </div>
            )}
            <div className="scrollbar mb-3 mt-5 h-full overflow-y-auto px-3" style={{ msScrollbarTrackColor: "white" }}>
                {renderContent()}
            </div>
        </Loading>
    );
};

export default AlertTab;
