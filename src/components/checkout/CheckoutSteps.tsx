import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Dados e Pedido' },
  { number: 2, title: 'Endereço' },
  { number: 3, title: 'Pagamento' },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                currentStep > step.number
                  ? 'bg-primary text-primary-foreground'
                  : currentStep === step.number
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > step.number ? (
                <Check className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </span>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                currentStep > step.number ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
