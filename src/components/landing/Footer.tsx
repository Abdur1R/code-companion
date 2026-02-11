import { GitBranch } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <GitBranch className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold">
            PR<span className="text-primary">Reviewer</span>
          </span>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Powered by AI · Built for developers · Open to contributions
        </p>

        <a
          href="https://github.com/apps/pr-reviewer-bot"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          GitHub App →
        </a>
      </div>
    </footer>
  );
};

export default Footer;
