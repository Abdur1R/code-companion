import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    Save,
    GitBranch,
    Bot,
    Box,
    CheckCircle2,
    Loader2,
    Info,
    ArrowLeft,
    Settings as SettingsIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    saveInstallationSettings,
    getInstallation,
    getInstallationRepos,
    getUserId,
} from "@/services/installations";

const AI_PROVIDERS = [
    { value: "huggingface", label: "Hugging Face", desc: "" },
    { value: "groq", label: "Groq", desc: "" },
    // { value: "claude", label: "Claude", desc: "" },
    { value: "openrouter", label: "OpenRouter", desc: "" },
    // { value: "together", label: "Together", desc: "" },
    { value: "sambanova", label: "Sambanova", desc: "" },
];

interface Repo {
    id: number;
    name: string;
    full_name: string;
}

interface SettingsState {
    installationId: string;
    model?: string;
    autoReview: boolean;
    selectedrepos: Repo[];
    provider?: string;
}

const defaultSettings: SettingsState = {
    installationId: "",
    model: "",
    autoReview: true,
    selectedrepos: [],
    provider: ""
};

export default function SettingsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [dummyFlag, setDummyFlag] = useState(false);

    function updateField<K extends keyof SettingsState>(
        key: K,
        value: SettingsState[K]
    ) {
        if (key === "installationId") {
            setLoadingRepos(true);
        }
        setSettings((prev) => ({ ...prev, [key]: value }));
    }

    const params = new URLSearchParams(window.location.search);
    const installationId = params.get("installation_id");

    useEffect(() => {
        if (installationId) {
            setSettings((prev) => ({ ...prev, installationId }));
            setIsFirstVisit(true);
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.hash
            );
        }
        setInitialized(true);
    }, []);

    useEffect(() => {
        async function loadInstallation() {
            if (installationId) return;
            try {
                const data: any = await getInstallation(
                    Number(settings.installationId)
                );
                if (data && data.reviewer) {
                    setSettings((prev) => ({
                        ...prev,
                        installationId: String(data.installationId),
                        model: data.reviewer.model || "",
                        provider: data.reviewer.provider || "",
                        autoReview: data.reviewer.autoReview ?? true,
                        selectedrepos: data.selectedRepos || [],
                    }));
                    setIsFirstVisit(false);
                }
                // if (!(data && !Object.keys(data).includes("exists"))) {
                loadRepos();
                // }
            } catch (err) {
                console.error(err);
            }
        }

        async function loadRepos() {
            try {
                const res: any = await getInstallationRepos(
                    Number(installationId || settings.installationId || 0)
                );
                setSettings((prev) => ({
                    ...prev,
                    selectedrepos: res.repositories ?? [],
                }));
            } catch (err) {
                console.error(err);
                toast.error("Failed to load repositories");
            } finally {
                setLoadingRepos(false);
            }
        }

        if (settings.installationId) {
            loadInstallation();
        }
    }, [settings.installationId]);

    useEffect(() => {
        setDummyFlag((prev) => !prev);
    }, [settings.provider]);

    function toggleRepo(repoId: number) {
        setSelectedRepos((prev) =>
            prev.includes(repoId)
                ? prev.filter((id) => id !== repoId)
                : [...prev, repoId]
        );
    }

    async function handleSave() {
        if (!settings.installationId) {
            toast.error("Installation ID required");
            return;
        }
        if (!settings.provider) {
            toast.error("Please select AI provider");
            return;
        }
        try {
            const userId: any = await getUserId(Number(settings.installationId));
            await saveInstallationSettings(Number(settings.installationId), {
                user_id: userId || "",
                selected_repos: settings.selectedrepos,
                reviewer: {
                    provider: settings.provider || "",
                    model: settings.model || "",
                },
            });
            toast.success("Settings saved successfully");
            setSaving(true);
            setIsFirstVisit(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    }

    if (!initialized) return null;

    const hasInstallationId = settings.installationId.trim().length > 0;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0d1117",
                color: "#c9d1d9",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            }}
        >
            {/* Header */}
            <div
                style={{
                    maxWidth: 600,
                    margin: "0 auto",
                    padding: "24px 16px 0",
                }}
            >

                {/* Banner */}
                {hasInstallationId && isFirstVisit && (
                    <div
                        style={{
                            background: "rgba(35, 134, 54, 0.15)",
                            border: "1px solid rgba(35, 134, 54, 0.4)",
                            borderRadius: 8,
                            padding: "12px 16px",
                            marginBottom: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <CheckCircle2 size={18} color="#3fb950" />
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#e6edf3" }}>
                                GitHub App installed successfully
                            </div>
                            <div style={{ fontSize: 12, color: "#8b949e" }}>
                                Installation ID: {settings.installationId}
                            </div>
                        </div>
                    </div>
                )}

                {hasInstallationId && !isFirstVisit && !loadingRepos && (
                    <div
                        style={{
                            background: "rgba(56, 139, 253, 0.1)",
                            border: "1px solid rgba(56, 139, 253, 0.3)",
                            borderRadius: 8,
                            padding: "10px 14px",
                            marginBottom: 16,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 13,
                            color: "#e6edf3",
                        }}
                    >
                        <Info size={16} color="#58a6ff" />
                        Settings loaded successfully
                    </div>
                )}

                {/* Installation ID Card */}
                <div
                    style={{
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: 10,
                        padding: "20px 20px 18px",
                        marginBottom: 12,
                    }}
                >
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#e6edf3",
                        }}
                    >
                        <GitBranch size={16} color="#8b949e" />
                        Installation ID

                        {/* <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                        >
                            <div>
                                Installation ID
                            </div>
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 10,
                                    fontWeight: 200,
                                    color: "gray",
                                    marginBottom: 10,
                                }}
                            >
                                Enter installation ID for other fields or saved data to show up!
                            </label>
                        </div> */}
                    </label>
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 10,
                            fontWeight: 200,
                            color: "gray",
                            marginBottom: 10,
                        }}
                    >
                        Enter installation ID for other fields or saved data to show up!
                    </label>
                    <input
                        defaultValue={settings.installationId}
                        onBlur={(e) => updateField("installationId", e.target.value)}
                        placeholder="Enter installation ID"
                        style={{
                            width: "100%",
                            background: "#0d1117",
                            border: "1px solid #30363d",
                            borderRadius: 6,
                            padding: "8px 12px",
                            fontSize: 14,
                            color: "#c9d1d9",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                        onFocus={(e) =>
                            (e.target.style.borderColor = "#58a6ff")
                        }
                        onBlurCapture={(e) =>
                            (e.target.style.borderColor = "#30363d")
                        }
                    />
                </div>

                {/* Conditional sections */}
                {(!loadingRepos ? (hasInstallationId &&
                    <>
                        {/* Repositories Card */}
                        <div
                            style={{
                                background: "#161b22",
                                border: "1px solid #30363d",
                                borderRadius: 10,
                                padding: "20px 20px 18px",
                                marginBottom: 12,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom:
                                        settings.selectedrepos.length > 0 ? 12 : 0,
                                }}
                            >
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        fontSize: 14,
                                        fontWeight: 500,
                                        color: "#e6edf3",
                                    }}
                                >
                                    <Box size={16} color="#8b949e" />
                                    Repositories
                                </label>
                                {loadingRepos && (
                                    <Loader2
                                        size={16}
                                        color="#8b949e"
                                        className="animate-spin"
                                    />
                                )}
                            </div>

                            {settings.selectedrepos.map((repo) => (
                                <div
                                    key={repo.id}
                                    onClick={() => toggleRepo(repo.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "8px 12px",
                                        background: "#0d1117",
                                        border: "1px solid #30363d",
                                        borderRadius: 6,
                                        marginBottom: 6,
                                        cursor: "pointer",
                                        fontSize: 13,
                                        color: "#c9d1d9",
                                        transition: "border-color 0.15s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.borderColor = "#58a6ff")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.borderColor = "#30363d")
                                    }
                                >
                                    <GitBranch size={14} color="#8b949e" />
                                    {repo.full_name}
                                </div>
                            ))}
                        </div>

                        {/* AI Provider Card */}
                        <div
                            style={{
                                background: "#161b22",
                                border: "1px solid #30363d",
                                borderRadius: 10,
                                padding: "20px 20px 18px",
                                marginBottom: 16,
                            }}
                        >
                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "#e6edf3",
                                    marginBottom: 10,
                                }}
                            >
                                <Bot size={16} color="#8b949e" />
                                AI Provider
                            </label>
                            <select
                                value={settings.provider || ""}
                                onChange={(e) => updateField("provider", e.target.value)}
                                style={{
                                    width: "100%",
                                    background: "#0d1117",
                                    border: "1px solid #30363d",
                                    borderRadius: 6,
                                    padding: "8px 12px",
                                    fontSize: 14,
                                    color: settings.provider ? "#c9d1d9" : "#484f58",
                                    outline: "none",
                                    cursor: "pointer",
                                    boxSizing: "border-box",
                                    appearance: "none",
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238b949e' viewBox='0 0 16 16'%3E%3Cpath d='M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z'/%3E%3C/svg%3E")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right 12px center",
                                }}
                                onFocus={(e) =>
                                    (e.target.style.borderColor = "#58a6ff")
                                }
                                onBlur={(e) =>
                                    (e.target.style.borderColor = "#30363d")
                                }
                            >
                                <option value="" disabled>
                                    Select AI Provider
                                </option>
                                {AI_PROVIDERS.map((provider) => (
                                    <option key={provider.value} value={provider.value}>
                                        {provider.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Save Button */}
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px 24px",
                                    background: saving
                                        ? "#1a2a1f"
                                        : "linear-gradient(135deg, #238636, #2ea043)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: saving ? "not-allowed" : "pointer",
                                    transition: "opacity 0.15s",
                                    opacity: saving ? 0.6 : 1,
                                }}
                                onMouseEnter={(e) => {
                                    if (!saving) e.currentTarget.style.opacity = "0.9";
                                }}
                                onMouseLeave={(e) => {
                                    if (!saving) e.currentTarget.style.opacity = "1";
                                }}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )
                    :
                    <Loader2
                        size={16}
                        color="#8b949e"
                        className="animate-spin"
                    />
                )}
            </div>
        </div>
    );
}
