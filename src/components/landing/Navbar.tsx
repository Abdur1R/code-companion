import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <GitBranch className="h-4 w-4 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            PR<span className="text-primary">Reviewer</span>
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#ai-models" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            AI Models
          </a>
        </div>

        <a
          href="https://github.com/apps/ai-powered-pr-reviewer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="hero" size="sm">
            Install GitHub App
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
