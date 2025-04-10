import { RegistrationDataType } from "@/pages/AppPage/components/AppMenu/AlertTab/types";
import { useState } from "react";

const useRegistrationState = () => {
    const [registrationData, setRegistrationData] = useState<RegistrationDataType | null>(null);

    return { registrationData, setRegistrationData };
};
export default useRegistrationState;
