import { AlertRegistrationContext } from "@/context";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";

interface IPropsStepControl extends React.ComponentPropsWithRef<"div"> {
    registrationData?: any;
}

const StepControl: React.FC<IPropsStepControl> = ({ registrationData }) => {
    const [disableNext, setDisableNext] = useState(false);
    const { currentStep, setCurrentStep, maxStep, registrationLoading, registerAlert } =
        useContext(AlertRegistrationContext);

    const handlePrevious = useCallback(() => {
        setCurrentStep((prev) => Math.max(0, prev - 1));
    }, [setCurrentStep]);

    const handleNext = useCallback(() => {
        setCurrentStep((prev) => Math.min(maxStep, prev + 1));
    }, [setCurrentStep, maxStep]);

    const handleFinish = useCallback(() => {
        setCurrentStep(maxStep);
        registerAlert();
    }, [setCurrentStep, maxStep, registerAlert]);

    const isLastStep = currentStep >= maxStep - 1;

    useEffect(() => {
        const disableState =
            currentStep === 0 && (!registrationData || !registrationData.province_id || !registrationData.district_id);

        setDisableNext(disableState);
    }, [registrationData]);

    return (
        <div className="mt-6 flex w-full flex-row items-center justify-center gap-4">
            {!isLastStep ? (
                <>
                    <Button
                        type="default"
                        onClick={handlePrevious}
                        icon={<ArrowLeftOutlined />}
                        className="h-8 rounded-lg px-6 text-sm"
                        aria-label="Quay lại">
                        Quay lại
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleNext}
                        icon={<ArrowRightOutlined />}
                        className="h-8 rounded-lg px-6 text-sm"
                        aria-label="Tiếp"
                        disabled={disableNext}>
                        Tiếp
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        type="default"
                        onClick={handlePrevious}
                        icon={<ArrowLeftOutlined />}
                        className="h-8 rounded-lg px-6 text-sm"
                        aria-label="Quay lại">
                        Quay lại
                    </Button>
                    <Button
                        type="primary"
                        loading={registrationLoading}
                        onClick={handleFinish}
                        icon={<CheckOutlined />}
                        className="h-8 rounded-lg px-6 text-sm"
                        aria-label="Hoàn thành">
                        Hoàn thành
                    </Button>
                </>
            )}
        </div>
    );
};

export default StepControl;
