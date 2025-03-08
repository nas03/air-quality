import { Steps } from "antd";
import { RegistrationDataType } from "../types";
import GetLocation from "./GetLocation";
import RegisterAlertInfo from "./RegisterAlertInfo";
import RegisterSettings from "./RegisterSettings";

interface IPropsRegistrationSteps extends React.ComponentPropsWithoutRef<"div"> {
  setRegistrationData: React.Dispatch<React.SetStateAction<RegistrationDataType | null>>;
  registrationData: RegistrationDataType | null;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const RegistrationSteps: React.FC<IPropsRegistrationSteps> = ({
  setRegistrationData,
  registrationData,
  currentStep,
}) => {
  return (
    <>
      <Steps
        current={currentStep}
        direction="vertical"
        items={[
          {
            title: "Get your location",
            description: (
              <div className="">
                <GetLocation registrationData={registrationData} setRegistrationData={setRegistrationData} />
              </div>
            ),
          },
          {
            title: "Customize Alert Information",
            description: <RegisterAlertInfo />,
          },
          {
            title: "Additional Settings",
            description: <RegisterSettings />,
          },
        ]}
      />
    </>
  );
};

export default RegistrationSteps;
