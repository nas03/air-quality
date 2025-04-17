import { Steps } from "antd";
import { RegistrationDataType } from "../types";
import GetLocation from "./GetLocation";
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
                size="small"
                items={[
                    {
                        title: <p className="text-base font-semibold">Lựa chọn địa điểm</p>,
                        subTitle: (
                            <p>
                                Nhấn <span className="font-medium text-blue-600">Vị trí hiện tại</span> và{" "}
                                <span className="font-medium text-blue-600">Cho phép</span> để lấy vị trí hiện tại của
                                bạn
                            </p>
                        ),
                        description: (
                            <div className="mt-3">
                                <GetLocation
                                    registrationData={registrationData}
                                    setRegistrationData={setRegistrationData}
                                />
                            </div>
                        ),
                    },
                    /*  {
                        title: <p className="text-base font-semibold">Tuỳ chỉnh cảnh báo</p>,
                        description: <RegisterAlertInfo />,
                    }, */
                    {
                        title: <p className="text-base font-semibold">Tuỳ chỉnh nhận thông báo</p>,
                        description: <RegisterSettings />,
                    },
                ]}
            />
        </>
    );
};

export default RegistrationSteps;
