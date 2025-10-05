import React from "react";

interface HeroDaisyUIGradientProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
}

export const HeroDaisyUIGradient: React.FC<HeroDaisyUIGradientProps> = ({
  title = "Hello there",
  subtitle = "Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.",
  buttonText = "Get Started",
  buttonHref = "#"
}) => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6">
            {subtitle}
          </p>
          <a href={buttonHref} className="btn btn-primary">
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};