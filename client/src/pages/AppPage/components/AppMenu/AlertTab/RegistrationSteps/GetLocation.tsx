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

  return (
    <div>
      <p>
        Click <span className="font-medium text-blue-600">Get Location</span> and <strong>Allow</strong> to get your
        current location
      </p>
      <RegisterLocation registrationData={registrationData} />
      <div className="mt-5 flex w-full flex-row items-center justify-between gap-4">
        <Button type="primary" onClick={handleGetUserDistrict} className="flex-1" disabled={currentStep !== 0}>
          Get Location
        </Button>
      </div>
      {currentStep === 0 && (
        <div className="flex-1">
          <StepControl />
        </div>
      )}
    </div>
  );
};

export default GetLocation;
