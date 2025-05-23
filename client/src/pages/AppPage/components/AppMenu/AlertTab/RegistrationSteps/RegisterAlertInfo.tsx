import { AlertRegistrationContext } from "@/context";
import { Form, Switch, Typography } from "antd";
import { useContext } from "react";
import { FaCloud, FaTemperatureFull } from "react-icons/fa6";
import { FiWind } from "react-icons/fi";
import StepControl from "./StepControl";
interface IPropsRegisterAlertInfo extends React.ComponentPropsWithRef<"div"> {}
const RegisterAlertInfo: React.FC<IPropsRegisterAlertInfo> = () => {
    const { currentStep } = useContext(AlertRegistrationContext);
    return (
        <div className="mt-3 flex flex-col items-start gap-5 text-sm">
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-row items-center gap-1">
                    <FaCloud size={20} />
                    <Typography.Text className="font-normal">Chất lượng không khí</Typography.Text>
                </div>
                <Form.Item initialValue={true} name={"aqi_index"} valuePropName="checked" className="mb-0">
                    <Switch disabled={currentStep !== 1} />
                </Form.Item>
            </div>
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-row items-center gap-1">
                    <FaTemperatureFull size={20} />
                    <Typography.Text className="font-normal">Nhiệt độ</Typography.Text>
                </div>
                <Form.Item initialValue={true} name={"temperature"} valuePropName="checked" className="mb-0">
                    <Switch disabled={currentStep !== 1} />
                </Form.Item>
            </div>
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-row items-center gap-1">
                    <FiWind size={20} />
                    <Typography.Text className="font-normal">Gió</Typography.Text>
                </div>
                <Form.Item initialValue={true} name={"wind"} valuePropName="checked" className="mb-0">
                    <Switch disabled={currentStep !== 1} />
                </Form.Item>
            </div>
            {currentStep === 1 && <StepControl />}
        </div>
    );
};

export default RegisterAlertInfo;
