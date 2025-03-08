import { RegistrationDataType } from "@/pages/AppPage/components/AppMenu/AlertTab/types";
import { useEffect, useState } from "react";

const useRegistrationState = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationDataType | null>(null);
  const updateRegistrationStep = (currentStep: number) => {
    const registration = localStorage.getItem("alert_registration");
    if (!registration) {
      setRegistrationData(null);
      return;
    }
    const data = JSON.parse(registration) as RegistrationDataType;
    const payload = { ...data, step: currentStep };
    localStorage.setItem("alert_registration", JSON.stringify(payload));
    setRegistrationData(payload);
  };

  useEffect(() => {
    const registration = localStorage.getItem("alert_registration");
    if (!registration) {
      setRegistrationData(null);
      return;
    }
    setRegistrationData(JSON.parse(registration));
  }, []);

  useEffect(() => {
    if (registrationData) {
      localStorage.setItem("alert_registration", JSON.stringify(registrationData));
    }
  }, [registrationData]);
  return { registrationData, setRegistrationData, updateRegistrationStep };
};
export default useRegistrationState;
