import { AlertInfoType, getUserSetting, updateUserSetting } from "@/api/userSetting";
import { AlertRegistrationContext } from "@/context";
import { useAuth } from "@/hooks/useAuth";
import useRegistrationState from "@/hooks/useRegistrationState";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button, Form } from "antd";
import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import RegistrationSteps from "./RegistrationSteps/RegistrationSteps";

interface IPropsAlertRegistration extends React.ComponentPropsWithoutRef<"div"> {
  setRefetchNotification: React.Dispatch<SetStateAction<boolean>>;
}

const MAX_STEP = 3;
const INITIAL_STEP = -1;

const AlertRegistration: React.FC<IPropsAlertRegistration> = ({ className, setRefetchNotification }) => {
  const { registrationData, setRegistrationData } = useRegistrationState();
  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  const [form] = Form.useForm<AlertInfoType>();
  const { user } = useAuth();
  const userId = user?.user_id ? Number(user.user_id) : undefined;

  const { data: userSettingData } = useQuery({
    queryKey: ["setting", userId],
    queryFn: () => getUserSetting(userId as number),
    enabled: !!userId,
  });

  const registerAlert = async () => {
    try {
      setRegistrationLoading(true);
      const formData = form.getFieldsValue();
      await updateUserSetting(user?.user_id, formData);
      setRefetchNotification(true);
    } catch (error) {
      console.error("Error registering alert:", error);
    } finally {
      setRegistrationLoading(false);
    }
  };

  useEffect(() => {
    if (registrationData) {
      setCurrentStep(Number(registrationData.step));
    }
  }, [registrationData]);

  useEffect(() => {
    if (registrationData) {
      form.setFieldsValue({
        district_id: registrationData.district_id,
        province_id: registrationData.province_id,
      });
    }
  }, [registrationData, form]);

  useEffect(() => {
    if (!userSettingData && currentStep === MAX_STEP) {
      registerAlert();
    }
  }, [currentStep]);

  // Context value memoized to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      maxStep: MAX_STEP,
      registrationLoading,
    }),
    [currentStep, registrationLoading],
  );

  // Show intro screen if not started registration
  if (!registrationData && currentStep === INITIAL_STEP) {
    return (
      <div className={cn("bg-white px-3 pt-3", className)}>
        <p className="mb-4 text-base font-normal text-zinc-800">
          Click <span className="font-medium text-blue-600">Get Started</span> to start receiving air quality alerts at
          your location
        </p>
        <div className="flex flex-row justify-center pt-3"></div>
        <Button
          onClick={() => setCurrentStep(0)}
          className="h-10 px-6 font-medium transition-opacity hover:opacity-90"
          type="primary">
          Get Started
        </Button>
      </div>
    );
  }

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
