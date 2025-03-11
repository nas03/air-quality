import { createUserAlertSetting } from "@/api/alertSetting";
import { AlertInfoType } from "@/api/userSetting";
import { AlertRegistrationContext } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import useRegistrationState from "@/hooks/useRegistrationState";
import { cn } from "@/lib/utils";
import { AlertSetting } from "@/types/db";
import { Button, Form } from "antd";
import React, { SetStateAction, useCallback, useEffect, useMemo } from "react";
import RegistrationSteps from "./RegistrationSteps/RegistrationSteps";

interface IPropsAlertRegistration extends React.ComponentPropsWithoutRef<"div"> {
  setRefetchNotification: React.Dispatch<SetStateAction<boolean>>;
  alertSettingData: AlertSetting[];
  setAddAlert: React.Dispatch<SetStateAction<boolean>>;
}

const MAX_STEP = 3;
const INITIAL_STEP = -1;

const AlertRegistration: React.FC<IPropsAlertRegistration> = ({ className, setRefetchNotification, setAddAlert }) => {
  const { registrationData, setRegistrationData } = useRegistrationState();
  const [form] = Form.useForm<AlertInfoType>();
  const { user } = useAuth();
  const userId = user?.user_id ? Number(user.user_id) : undefined;

  const [currentStep, setCurrentStep] = React.useState(INITIAL_STEP);
  const [registrationLoading, setRegistrationLoading] = React.useState(false);

  const handleRegisterAlert = useCallback(async () => {
    if (!userId) return;

    try {
      setRegistrationLoading(true);
      const formData = form.getFieldsValue();

      const payload: Omit<AlertSetting, "id"> = {
        user_id: userId,
        district_id: formData.district_id,
        aqi_index: formData.aqi_index,
        pm_25: formData.aqi_index,
        temperature: formData.temperature,
        wind_speed: formData.wind,
        weather: true,
      };

      await createUserAlertSetting(payload);
      setRefetchNotification(true);
    } catch (error) {
      console.error("Error registering alert:", error);
    } finally {
      setRegistrationLoading(false);
      setAddAlert(false);
    }
  }, [form, userId, setRefetchNotification]);

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

  if (!registrationData && currentStep === INITIAL_STEP) {
    return (
      <div className={cn("bg-white px-3 pt-3", className)}>
        <p className="mb-4 text-base font-normal text-zinc-800">
          Click <span className="font-medium text-blue-600">Get Started</span> to start receiving air quality alerts at
          your designated location
        </p>
        <div className="flex flex-row justify-center pt-3">
          <Button
            onClick={() => setCurrentStep(0)}
            className="h-10 px-6 font-medium transition-opacity hover:opacity-90"
            type="primary">
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  // Render registration steps
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
