import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const models = [
  {
    name: "HuggingFace Code Reviewer",
    badge: "Active",
    badgeVariant: "default" as const,
    description: "Our current default model. Specialized in code review tasks with strong pattern recognition.",
    capabilities: ["Bug detection", "Code style", "Best practices", "Security hints"],
  },
  {
    name: "GPT-4 Code Review",
    badge: "Coming Soon",
    badgeVariant: "secondary" as const,
    description: "OpenAI's most capable model for nuanced, context-aware code reviews.",
    capabilities: ["Deep reasoning", "Architecture feedback", "Refactoring", "Documentation"],
  },
  {
    name: "Claude Code Analyst",
    badge: "Coming Soon",
    badgeVariant: "secondary" as const,
    description: "Anthropic's model excelling at understanding complex codebases and providing safe suggestions.",
    capabilities: ["Large context", "Safety analysis", "Detailed explanations", "Multi-file review"],
  },
  {
    name: "Gemini Code Review",
    badge: "Coming Soon",
    badgeVariant: "secondary" as const,
    description: "Google's multimodal model with excellent understanding of modern frameworks.",
    capabilities: ["Framework-aware", "Performance tips", "Test suggestions", "Type safety"],
  },
];

const AIModels = () => {
  return (
    <section id="ai-models" className="relative py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-mono text-sm text-primary">// ai-models</span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Choose your <span className="gradient-text">AI reviewer</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Pick the AI model that best fits your team's needs. More options coming soon.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          {models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-6 transition-all duration-300 ${
                model.badge === "Active"
                  ? "border-primary/30 bg-primary/5 glow-border"
                  : "border-border/50 bg-card/50 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <Badge variant={model.badgeVariant} className={model.badge === "Active" ? "bg-primary/20 text-primary border-primary/30" : ""}>
                  {model.badge}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{model.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {model.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                  >
                    <Check className="h-3 w-3 text-primary" />
                    {cap}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIModels;
