import { AlertRegistrationContext } from "@/context";
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
  if (!registrationData)
    return (
      <div>
        <p>
          Click <span className="font-medium text-blue-600">Get Location</span> and <strong>Allow</strong> to get your
          current location
        </p>
        <RegisterLocation />
        <div className="flex w-full flex-row items-center justify-center mt-5">
          <Button type="primary" onClick={handleGetUserDistrict}>
            Get Location
          </Button>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col">
      <p className="mb-3">
        Click <span className="font-medium text-blue-600">Next</span> to verify your current location
      </p>
      <RegisterLocation />
      {currentStep === 0 && <StepControl />}
    </div>
  );
};

export default GetLocation;
