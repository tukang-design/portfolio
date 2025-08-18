import { MessageCircle, Palette, Rocket } from "lucide-react";

const ProcessSection = () => {
  const steps = [
    {
      icon: <MessageCircle className="w-12 h-12 text-[hsl(var(--neon-green))]" />,
      title: "Free Discovery Consultation",
      description: "We start with a call to understand your business goals. No fluff, just strategy."
    },
    {
      icon: <Palette className="w-12 h-12 text-[hsl(var(--neon-green))]" />,
      title: "Design & Build",
      description: "We get to work, crafting your brand or website with skill and precision."
    },
    {
      icon: <Rocket className="w-12 h-12 text-[hsl(var(--neon-green))]" />,
      title: "Handover & Launch",
      description: "We deliver the final files and launch your site. You're ready to go!"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            The Process
          </h2>
          <h3 className="text-2xl font-semibold text-white mb-4">
            Our 3-Step Process
          </h3>
          <p className="text-lg text-muted-foreground">
            Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-px bg-border z-0" />
              )}
              
              {/* Step Content */}
              <div className="relative z-10 bg-card rounded-2xl p-8 shadow-soft border border-border/50 hover:shadow-bold transition-all duration-300">
                {/* Step Number */}
                <div className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold mb-6">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-xl">
                    {step.icon}
                  </div>
                </div>
                
                {/* Content */}
                <h4 className="text-xl font-bold text-white mb-4">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;