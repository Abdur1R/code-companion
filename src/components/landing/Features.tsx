import { motion } from "framer-motion";
import { Zap, Shield, Eye, Code2, Clock, GitMerge } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get review comments within seconds of opening a PR. No waiting for human reviewers.",
  },
  {
    icon: Eye,
    title: "Line-by-Line Analysis",
    description: "Detailed inline comments on specific lines with actionable suggestions.",
  },
  {
    icon: Shield,
    title: "Bug Detection",
    description: "Catches potential bugs, security vulnerabilities, and anti-patterns automatically.",
  },
  {
    icon: Code2,
    title: "Code Quality",
    description: "Enforces best practices, clean code principles, and consistent patterns.",
  },
  {
    icon: Clock,
    title: "Save Hours Weekly",
    description: "Reduce review time by up to 80%. Let AI handle the tedious parts.",
  },
  {
    icon: GitMerge,
    title: "Merge Confidence",
    description: "Ship with confidence knowing every PR has been thoroughly reviewed.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-32">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-mono text-sm text-primary">// features</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need for
            <br />
            <span className="gradient-text">better code reviews</span>
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-primary/20 hover:bg-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
