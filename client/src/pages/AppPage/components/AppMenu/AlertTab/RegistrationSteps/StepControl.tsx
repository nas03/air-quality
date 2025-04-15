import { AlertRegistrationContext } from "@/context";
import { Button } from "antd";
import React, { useCallback, useContext } from "react";

interface IPropsStepControl extends React.ComponentPropsWithRef<"div"> {}

const StepControl: React.FC<IPropsStepControl> = () => {
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

    return (
        <div className="mt-3 flex w-full flex-row items-center justify-center gap-4">
            {!isLastStep ? (
                <>
                    <Button type="default" onClick={handlePrevious}>
                        Quay lại
                    </Button>
                    <Button type="primary" onClick={handleNext}>
                        Tiếp
                    </Button>
                </>
            ) : (
                <>
                    <Button type="default" onClick={handlePrevious}>
                        Quay lại
                    </Button>

                    <Button type="primary" loading={registrationLoading} onClick={handleFinish}>
                        Hoàn thành
                    </Button>
                </>
            )}
        </div>
    );
};

export default StepControl;
