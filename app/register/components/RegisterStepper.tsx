import { Check } from "lucide-react";
import { RegistrationStep } from "../types";
import styles from "../register.module.css";

export interface RegisterStepperProps {
  currentStep: number;
  steps: RegistrationStep[];
  onStepClick: (stepId: number) => void;
}

const labels = ["Team", "College", "Review", "Pass"];

export function RegisterStepper({ currentStep, steps, onStepClick }: RegisterStepperProps) {
  return (
    <nav className={styles.stepper} aria-label="Registration progress">
      <ol className={styles.stepList}>
        {steps.map((step, index) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <li key={step.id} className={styles.stepItem}>
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                disabled={!completed || currentStep === 4}
                aria-current={active ? "step" : undefined}
                aria-label={step.label + (completed ? ", completed" : "")}
                className={[styles.stepButton, active ? styles.activeStep : completed ? styles.completedStep : ""].join(" ")}
              >
                <span className={styles.stepNumber}>{completed ? <Check size={12} aria-hidden="true" /> : step.id}</span>
                <span>{labels[index]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
