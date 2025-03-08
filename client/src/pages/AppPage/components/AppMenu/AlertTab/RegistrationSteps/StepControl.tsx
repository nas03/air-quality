import { AlertRegistrationContext } from "@/context";
import useRegistrationState from "@/hooks/useRegistrationState";
import { Button } from "antd";
import React, { useCallback, useContext } from "react";

interface IPropsStepControl extends React.ComponentPropsWithRef<"div"> {}

const StepControl: React.FC<IPropsStepControl> = () => {
  const { currentStep, setCurrentStep, maxStep, registrationLoading } = useContext(AlertRegistrationContext);
  const { updateRegistrationStep } = useRegistrationState();

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => {
      const step = Math.max(0, prev - 1);
      updateRegistrationStep(step);
      return step;
    });
  }, [setCurrentStep, updateRegistrationStep]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      const step = Math.min(maxStep, prev + 1);
      updateRegistrationStep(step);
      return step;
    });
  }, [setCurrentStep, updateRegistrationStep, maxStep]);

  const isLastStep = currentStep >= maxStep - 1;

  return (
    <div className="mt-3 flex w-full flex-row items-center justify-center gap-4">
      {!isLastStep ? (
        <>
          <Button type="default" onClick={handlePrevious}>
            Previous
          </Button>
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        </>
      ) : (
        <>
          {/* {currentStep !== maxStep && ( */}
            <Button type="default" onClick={handlePrevious}>
              Previous
            </Button>
          {/* )} */}
          <Button type="primary" loading={registrationLoading} onClick={handleNext}>
            Finish
          </Button>
        </>
      )}
    </div>
  );
};

export default StepControl;
