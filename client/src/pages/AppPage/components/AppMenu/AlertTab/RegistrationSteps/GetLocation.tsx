import { AlertRegistrationContext } from "@/context";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useContext } from "react";
import { RegistrationDataType } from "../types";
import { getCurrentLocation } from "../utils";
import RegisterLocation from "./RegisterLocation";
import StepControl from "./StepControl";

interface IPropsGetLocation extends React.ComponentPropsWithRef<"div"> {
    setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationDataType | null>>;
    registrationData: RegistrationDataType | null;
}
const GetLocation: React.FC<IPropsGetLocation> = ({ setRegistrationData, registrationData }) => {
    const handleGetUserDistrict = getCurrentLocation(setRegistrationData);
    const { currentStep } = useContext(AlertRegistrationContext);

    return (
        <div>
            <RegisterLocation registrationData={registrationData} setRegistrationData={setRegistrationData} />

            <div className="mt-5 flex w-full flex-row items-center justify-between gap-4">
                <Button
                    type="primary"
                    icon={<EnvironmentOutlined />}
                    onClick={handleGetUserDistrict}
                    className="h-9 flex-1 rounded-lg text-sm 2xl:text-base"
                    disabled={currentStep !== 0}>
                    Sử dụng vị trí hiện tại
                </Button>
            </div>
            {currentStep === 0 && (
                <div className="flex-1">
                    <StepControl registrationData={registrationData} />
                </div>
            )}
        </div>
    );
};

export default GetLocation;
