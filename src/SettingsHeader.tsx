import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
const SettingsHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-border">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
            <p className="text-xs text-muted-foreground">Configure your PR Reviewer integration</p>
          </div>
        </div>
      </div>
    </header>
  );
};
export default SettingsHeader;