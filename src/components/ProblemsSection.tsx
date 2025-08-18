import { AlertTriangle, Smartphone, TrendingDown } from "lucide-react";

const ProblemsSection = () => {
  const problems = [
    {
      icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
      title: "My logo looks DIY... tak nampak profesional.",
      description: "Your brand is your promise. A weak logo tells customers you might not be serious. It kills trust instantly."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-destructive" />,
      title: "My website looks terrible on my phone!",
      description: "More than 80% of your customers are on mobile. If your site is broken on their phone, you're losing 8 out of 10 leads. Sayang, kan?"
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-destructive" />,
      title: "I get traffic, but zero inquiries. Sunyi je.",
      description: "This is the silent killer. A confusing website with no clear direction chases your customers away... straight to your competitors."
    }
  ];

  return (
    <section className="py-20 bg-section-bg">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            Stop Losing Customers to a Bad First Impression.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Bunyi macam familiar tak?
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div key={index} className="bg-card rounded-xl p-8 shadow-soft border border-border/50 hover:shadow-bold transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-destructive/10 rounded-lg">
                  {problem.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-2">#{index + 1}</div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    "{problem.title}"
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;