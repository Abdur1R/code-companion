import { motion } from "framer-motion";
import { Download, GitPullRequest, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Download,
    step: "01",
    title: "Install the GitHub App",
    description:
      "Add our GitHub App to your profile and select the repositories you want to monitor.",
  },
  {
    icon: GitPullRequest,
    step: "02",
    title: "Open a Pull Request",
    description:
      "Work as usual. Every time a PR is opened, our bot is automatically triggered.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Get AI Review Comments",
    description:
      "Receive detailed, inline code review comments with suggestions, warnings, and fixes.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-mono text-sm text-primary">// how-it-works</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Three steps to smarter reviews
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            No configuration needed. Install and let the bot handle the rest.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative"
            >
              <div className="gradient-border rounded-xl bg-card p-8 transition-all duration-300 hover:glow-border">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-mono text-3xl font-bold text-muted-foreground/20">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-muted-foreground/20 md:block">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
