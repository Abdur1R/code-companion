import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Save, GitBranch, Bot, Box, CheckCircle2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
const STORAGE_KEY = "pr-reviewer-settings";
const AI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o", desc: "Best quality, slower" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", desc: "Fast & affordable" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", desc: "Great for code" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku", desc: "Fastest responses" },
  { value: "gemini-pro", label: "Gemini Pro", desc: "Google's best" },
];
const MOCK_REPOS = [
  { value: "all", label: "All repositories" },
  { value: "frontend", label: "org/frontend" },
  { value: "backend", label: "org/backend-api" },
  { value: "mobile", label: "org/mobile-app" },
  { value: "infra", label: "org/infrastructure" },
  { value: "docs", label: "org/documentation" },
];
const REVIEW_STYLES = [
  { value: "thorough", label: "Thorough", desc: "Deep analysis of every change" },
  { value: "concise", label: "Concise", desc: "Key issues only" },
  { value: "security", label: "Security-focused", desc: "Prioritize vulnerabilities" },
  { value: "performance", label: "Performance-focused", desc: "Optimize for speed" },
];
interface SettingsData {
  installationId: string;
  selectedRepos: string;
  aiModel: string;
  reviewStyle: string;
  autoReview: boolean;
}
const defaultSettings: SettingsData = {
  installationId: "",
  selectedRepos: "",
  aiModel: "",
  reviewStyle: "",
  autoReview: true,
};
const SettingsForm = () => {
  const [searchParams] = useSearchParams();
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    // Check for saved settings
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setIsFirstVisit(false);
      } catch {
        // ignore
      }
    }
    // Check URL params for installation_id (from GitHub redirect)
    const installationId = searchParams.get("installation_id");
    if (installationId) {
      setSettings((prev) => ({ ...prev, installationId }));
      setIsFirstVisit(true);
    }
    setLoaded(true);
  }, [searchParams]);
  const handleSave = async () => {
    if (!settings.installationId) {
      toast.error("Installation ID is required");
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaving(false);
    setIsFirstVisit(false);
    toast.success("Settings saved successfully!");
  };
  const updateField = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
  if (!loaded) return null;
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6 animate-fade-in">
      {/* Status banner */}
      {isFirstVisit && settings.installationId && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">GitHub App installed successfully</p>
            <p className="text-xs text-muted-foreground">
              Installation ID <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{settings.installationId}</code> detected. Complete setup below.
            </p>
          </div>
        </div>
      )}
      {!isFirstVisit && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-accent border border-border">
          <Info className="w-5 h-5 text-info flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            Your settings are loaded. Make changes and save to update.
          </p>
        </div>
      )}
      {/* Installation ID */}
      <section className="space-y-4 p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">GitHub Connection</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="installationId" className="text-sm text-muted-foreground">
            Installation ID
          </Label>
          <Input
            id="installationId"
            value={settings.installationId}
            onChange={(e) => updateField("installationId", e.target.value)}
            placeholder="e.g. 12345678"
            className="font-mono bg-muted border-border focus:border-primary focus:ring-primary/20 h-11"
          />
          <p className="text-xs text-muted-foreground">
            Auto-populated from GitHub. You can also enter it manually.
          </p>
        </div>
      </section>
      {/* Repositories */}
      <section className="space-y-4 p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-1">
          <Box className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Repositories</h2>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Select repositories to review</Label>
          <Select value={settings.selectedRepos} onValueChange={(v) => updateField("selectedRepos", v)}>
            <SelectTrigger className="bg-muted border-border h-11 focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Choose repositories..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {MOCK_REPOS.map((repo) => (
                <SelectItem key={repo.value} value={repo.value}>
                  <span className="font-mono text-sm">{repo.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>
      {/* AI Model */}
      <section className="space-y-4 p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">AI Configuration</h2>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">AI Model</Label>
          <Select value={settings.aiModel} onValueChange={(v) => updateField("aiModel", v)}>
            <SelectTrigger className="bg-muted border-border h-11 focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Select an AI model..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {AI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.label}</span>
                    <span className="text-xs text-muted-foreground">— {model.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Review Style</Label>
          <Select value={settings.reviewStyle} onValueChange={(v) => updateField("reviewStyle", v)}>
            <SelectTrigger className="bg-muted border-border h-11 focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Select review style..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {REVIEW_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{style.label}</span>
                    <span className="text-xs text-muted-foreground">— {style.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
          <div>
            <p className="text-sm font-medium text-foreground">Auto-review new PRs</p>
            <p className="text-xs text-muted-foreground">Automatically review when a PR is opened</p>
          </div>
          <button
            onClick={() => updateField("autoReview", !settings.autoReview)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.autoReview ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
                settings.autoReview ? "translate-x-5 bg-primary-foreground" : "bg-muted-foreground"
              }`}
            />
          </button>
        </div>
      </section>
      {/* Save */}
      <div className="flex justify-end pt-2 pb-8">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow-primary transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
export default SettingsForm;