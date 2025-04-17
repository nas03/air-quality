import { createUserAlertSetting } from "@/api/alertSetting";
import { AlertRegistrationContext } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import useRegistrationState from "@/hooks/useRegistrationState";
import { RECEIVE_NOTIFICATIONS } from "@/types/consts";
import { AlertSetting } from "@/types/db";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Form } from "antd";
import React, { SetStateAction, useEffect, useMemo } from "react";
import RegistrationSteps from "./RegistrationSteps/RegistrationSteps";

interface IPropsAlertRegistration extends React.ComponentPropsWithoutRef<"div"> {
    refetchNotifications: (options?: RefetchOptions) => Promise<QueryObserverResult<any[], Error>>;
    alertSettingData: AlertSetting[];
    setAddAlert: React.Dispatch<SetStateAction<boolean>>;
}

const MAX_STEP = 2;
const INITIAL_STEP = 0;

const AlertRegistration: React.FC<IPropsAlertRegistration> = ({ refetchNotifications, setAddAlert }) => {
    const { registrationData, setRegistrationData } = useRegistrationState();
    const [form] = Form.useForm();
    const { user } = useAuth();
    const userId = user?.user_id ? Number(user.user_id) : undefined;

    const [currentStep, setCurrentStep] = React.useState(INITIAL_STEP);
    const [registrationLoading, setRegistrationLoading] = React.useState(false);

    const handleRegisterAlert = async () => {
        if (!userId) return;

        try {
            setRegistrationLoading(true);
            const formData = form.getFieldsValue();

            let receive_notifications = RECEIVE_NOTIFICATIONS.EMAIL_NOTIFICATION;
           /*  if (formData.sms_notification && !formData.email_notification)
                receive_notifications = RECEIVE_NOTIFICATIONS.SMS_NOTIFICATION;
            else if (!formData.sms_notification && formData.email_notification)
                receive_notifications = RECEIVE_NOTIFICATIONS.EMAIL_NOTIFICATION;
            else if (formData.sms_notification && formData.email_notification)
                receive_notifications = RECEIVE_NOTIFICATIONS.BOTH; */

            const payload: Omit<AlertSetting, "id"> = {
                user_id: userId,
                district_id: formData.district_id,
                aqi_index: formData.aqi_index || true,
                pm_25: formData.aqi_index || true,
                temperature: formData.temperature || true,
                wind_speed: formData.wind || true,
                weather: true,
                receive_notifications,
            };

            await createUserAlertSetting(payload);
            refetchNotifications();
            setAddAlert(false);
        } catch (error) {
            console.error("Error registering alert:", error);
        } finally {
            setRegistrationLoading(false);
            setAddAlert(false);
        }
    };

    useEffect(() => {
        if (registrationData) {
            setCurrentStep(Number(registrationData.step));
            form.setFieldsValue({
                district_id: registrationData.district_id,
                province_id: registrationData.province_id,
            });
        }
    }, [registrationData, form]);

    const contextValue = useMemo(
        () => ({
            currentStep,
            setCurrentStep,
            maxStep: MAX_STEP,
            registrationLoading,
            setRegistrationLoading,
            registerAlert: handleRegisterAlert,
        }),
        [currentStep, registrationLoading, handleRegisterAlert],
    );

    return (
        <AlertRegistrationContext.Provider value={contextValue}>
            <Form form={form}>
                <RegistrationSteps
                    setCurrentStep={setCurrentStep}
                    currentStep={currentStep}
                    registrationData={registrationData}
                    setRegistrationData={setRegistrationData}
                />
            </Form>
        </AlertRegistrationContext.Provider>
    );
};

export default AlertRegistration;
