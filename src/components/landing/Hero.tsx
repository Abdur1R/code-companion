import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GitPullRequest, Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Code Reviews
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          Ship better code with{" "}
          <span className="gradient-text">AI reviews</span>{" "}
          on every PR
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Install once, get instant feedback on every pull request. Our bot catches bugs, 
          suggests improvements, and reviews code quality — so your team can focus on building.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="https://github.com/apps/pr-reviewer-bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="hero" size="lg" className="gap-2 px-8 py-6 text-base">
              <GitPullRequest className="h-5 w-5" />
              Install on GitHub
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#how-it-works">
            <Button variant="hero-outline" size="lg" className="px-8 py-6">
              See how it works
            </Button>
          </a>
        </motion.div>

        {/* Code preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-20 max-w-3xl"
        >
          <div className="gradient-border rounded-xl bg-card p-1">
            <div className="rounded-lg bg-code-bg p-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-4 mb-4">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">
                  pr-reviewer-bot — review comment
                </span>
              </div>
              <div className="space-y-3 text-left font-mono text-sm">
                <div className="flex gap-3">
                  <span className="select-none text-muted-foreground/40">1</span>
                  <span className="text-primary">🤖 PR Reviewer Bot</span>
                </div>
                <div className="flex gap-3">
                  <span className="select-none text-muted-foreground/40">2</span>
                  <span className="text-muted-foreground">───────────────────────</span>
                </div>
                <div className="flex gap-3">
                  <span className="select-none text-muted-foreground/40">3</span>
                  <span className="text-foreground/80">
                    <span className="text-warning">⚠</span> Line 42: Consider using <span className="text-primary">Optional</span> chaining
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="select-none text-muted-foreground/40">4</span>
                  <span className="text-foreground/80">
                    <span className="text-primary">✓</span> Type safety looks good across the module
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="select-none text-muted-foreground/40">5</span>
                  <span className="text-foreground/80">
                    <span className="text-destructive">✗</span> Potential memory leak in useEffect cleanup
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
