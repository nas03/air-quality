import { EnvironmentOutlined, NotificationOutlined } from "@ant-design/icons";
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
                        title: (
                            <span className="flex items-center gap-2 text-base font-semibold">
                                <EnvironmentOutlined className="text-blue-500" />
                                Lựa chọn địa điểm
                            </span>
                        ),
                        subTitle: (
                            <span className="text-xs text-gray-500">
                                Chọn tỉnh/thành phố và quận/huyện để nhận cảnh báo chất lượng không khí phù hợp vị trí
                                của bạn.
                            </span>
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

                    {
                        title: (
                            <span className="flex items-center gap-2 text-base font-semibold">
                                <NotificationOutlined className="text-green-500" />
                                Tuỳ chỉnh nhận thông báo
                            </span>
                        ),
                        subTitle: <span className="text-xs text-gray-500">Chọn phương thức nhận thông báo</span>,
                        description: <RegisterSettings registrationData={registrationData} />,
                    },
                ]}
            />
        </>
    );
};

export default RegistrationSteps;
