export interface StepFlowItem {
  icon?: string;
  label: string;
  description?: string;
}

export function StepFlow({
  steps,
  title,
}: {
  steps: StepFlowItem[];
  title?: string;
}) {
  return (
    <div className="step-flow">
      {title && <h2 className="section-title">{title}</h2>}
      <ol className="step-list">
        {steps.map((step, index) => (
          <li
            key={index}
            className="step-item"
            aria-label={`Step ${index + 1} of ${steps.length}: ${step.label}`}
          >
            <div className="step-num" aria-hidden="true">
              {index + 1}
            </div>
            <div className="step-content">
              {step.icon && (
                <span className="step-icon" aria-hidden="true">
                  {step.icon}
                </span>
              )}
              <div className="step-label">{step.label}</div>
              {step.description && (
                <p className="step-desc">{step.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
