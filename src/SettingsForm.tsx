import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Save,
    GitBranch,
    Bot,
    Box,
    CheckCircle2,
    Loader2,
    Info,
} from "lucide-react";

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

import {
    saveInstallationSettings,
    getInstallation,
    getInstallationRepos,
    getUserId,
} from "@/services/installations";

/**
 * AI Models
 */
const AI_MODELS = [
    { value: "huggingface", label: "Hugging Face", desc: "" },
    // { value: "gpt-4o", label: "GPT-4o", desc: "Best quality" },
    // { value: "gpt-4o-mini", label: "GPT-4o Mini", desc: "Fast & affordable" },
    // { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", desc: "Best for code" },
    // { value: "claude-3-haiku", label: "Claude 3 Haiku", desc: "Fastest" },
    // { value: "gemini-pro", label: "Gemini Pro", desc: "Google model" },
];

/**
 * Types
 */
interface Repo {
    id: number;
    name: string;
    full_name: string;
}

interface SettingsState {
    installationId: string;
    aiModel?: string;
    autoReview: boolean;
    selectedrepos: Repo[];
    aiProvider?: string;
}

const defaultSettings: SettingsState = {
    installationId: "",
    aiModel: "",
    autoReview: true,
    selectedrepos: [],
};

export default function SettingsPage() {
    const [searchParams] = useSearchParams();

    const [settings, setSettings] = useState<SettingsState>(defaultSettings);

    const [repos, setRepos] = useState<Repo[]>([]);
    const [selectedRepos, setSelectedRepos] = useState<number[]>([]);

    const [loadingRepos, setLoadingRepos] = useState(false);
    const [saving, setSaving] = useState(false);

    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [initialized, setInitialized] = useState(false);

    /**
     * Helper: update state field
     */
    function updateField<K extends keyof SettingsState>(
        key: K,
        value: SettingsState[K]
    ) {
        setSettings((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    // This reads query params BEFORE hash
    const params = new URLSearchParams(window.location.search);

    const installationId = params.get("installation_id");

    /**
     * STEP 1: Extract installation_id from URL
     */
    useEffect(() => {
        if (installationId) {

            setSettings(prev => ({
                ...prev,
                installationId: installationId,
            }));

            setIsFirstVisit(true);

            // clean URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.hash
            );
        }

        setInitialized(true);

    }, []);

    /**
     * STEP 2: Load installation settings from backend
     */
    useEffect(() => {
        async function loadInstallation() {
            if (installationId) return;

            try {
                const data = await getInstallation(
                    Number(settings.installationId)
                );

                if (data && data.reviewer) {
                    setSettings((prev) => ({
                        ...prev,
                        installationId: String(data.installationId),
                        aiModel: data.reviewer.model || "",
                        aiProvider: data.reviewer.provider || "",
                        autoReview: data.reviewer.autoReview ?? true,
                        selectedrepos: data.selectedRepos || [],
                    }));


                    // const repoIds =
                    //     data.selectedRepos?.map((r: Repo) => r.id) || [];

                    // setSelectedRepos(repoIds);

                    setIsFirstVisit(false);
                }

                console.log("data", data);
                if (!(data && data.installationId)) {
                    loadRepos();
                }
            } catch (err) {
                console.error(err);
            }
        }

        async function loadRepos() {
            // if (!installationId) return;

            setLoadingRepos(true);

            try {
                const res: any = await getInstallationRepos(
                    Number(installationId || settings.installationId || 0)
                );
                console.log("repos", res);
                setSettings((prev) => ({
                    ...prev,
                    selectedrepos: res.repositories ?? [],
                }));

                // setRepos(res.repositories ?? []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load repositories");
            } finally {
                setLoadingRepos(false);
            }
        }

        loadInstallation();
    }, [settings.installationId]);


    /**
     * Toggle repo selection
     */
    function toggleRepo(repoId: number) {
        setSelectedRepos((prev) =>
            prev.includes(repoId)
                ? prev.filter((id) => id !== repoId)
                : [...prev, repoId]
        );
    }

    /**
     * Save settings
     */
    async function handleSave() {
        if (!settings.installationId) {
            toast.error("Installation ID required");
            return;
        }

        if (!settings.aiModel) {
            toast.error("Please select AI model");
            return;
        }

        try {
            // const selectedRepoObjects = repos.filter((repo) =>
            //     selectedRepos.includes(repo.id)
            // );

            const userId: any = await getUserId(Number(settings.installationId));
            console.log("userId", userId);
            await saveInstallationSettings(
                Number(settings.installationId),
                {
                    user_id: userId || "", // replace with real auth
                    selected_repos: settings.selectedrepos,
                    reviewer: {
                        provider: settings.aiProvider || "",  // example: "groq"
                        model: settings.aiModel || "",       // example: "llama-3.3-70b-versatile"
                    },
                }
            );

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

    console.log("settings", settings);

    if (!initialized) return null;

    return (
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

            {/* Banner */}
            {settings.installationId && (
                isFirstVisit ? (
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border rounded-lg">
                        <CheckCircle2 className="text-primary" />
                        <div>
                            <p className="font-medium">
                                GitHub App installed successfully
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Installation ID: {settings.installationId}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                        <Info />
                        Settings loaded successfully
                    </div>
                )
            )}

            {/* Installation */}
            <section className="p-6 border rounded-xl space-y-2">

                <div className="flex gap-2 items-center">
                    <GitBranch size={16} />
                    <Label>Installation ID</Label>
                </div>

                <Input
                    defaultValue={settings.installationId ?? ""}
                    // value={settings.installationId}
                    // onChange={(e) =>
                    //     updateField("installationId", e.target.value)
                    // }
                    onBlur={(e) => {
                        updateField("installationId", e.target.value);
                    }}
                    placeholder="Enter installation ID"
                />

            </section>

            {/* Repositories */}
            <section className="p-6 border rounded-xl space-y-4">

                <div className="flex justify-between items-center">

                    <div className="flex gap-2 items-center">
                        <Box size={16} />
                        <span className="font-medium">
                            Repositories
                        </span>
                    </div>

                    {loadingRepos && (
                        <Loader2 className="animate-spin" size={16} />
                    )}

                </div>

                {settings.selectedrepos.map((repo) => {

                    const selected = selectedRepos.includes(repo.id);

                    return (
                        <div
                            key={repo.id}
                            // onClick={() => toggleRepo(repo.id)}
                            className={`p-3 border rounded-lg cursor-pointer flex justify-between transition
              ${selected
                                    ? "border-primary bg-primary/5"
                                    : "hover:border-primary/50"
                                }`}
                        >

                            <div className="flex gap-2 items-center">
                                <GitBranch size={16} />
                                <span className="font-mono">
                                    {repo.full_name}
                                </span>
                            </div>

                            {selected && (
                                <CheckCircle2
                                    size={16}
                                    className="text-primary"
                                />
                            )}

                        </div>
                    );

                })}

            </section>

            {/* AI Model */}
            <section className="p-6 border rounded-xl space-y-2">

                <div className="flex gap-2 items-center">
                    <Bot size={16} />
                    <Label>AI Model</Label>
                </div>

                <Select
                    value={settings.aiModel}
                    onValueChange={(value) =>
                        updateField("aiProvider", value)
                    }
                >

                    <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>

                    <SelectContent>

                        {AI_MODELS.map((model) => (

                            <SelectItem
                                defaultValue={settings.aiProvider || ""}
                                key={model.value}
                                value={model.value}
                            >
                                {model.label} — {model.desc}
                            </SelectItem>

                        ))}

                    </SelectContent>

                </Select>

            </section>

            {/* Auto Review */}
            {/* <section className="p-6 border rounded-xl flex justify-between items-center">

                <div>
                    <p className="font-medium">
                        Auto-review pull requests
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Automatically review new PRs
                    </p>
                </div>

                <button
                    onClick={() =>
                        updateField(
                            "autoReview",
                            !settings.autoReview
                        )
                    }
                    className={`w-12 h-6 rounded-full transition
            ${settings.autoReview
                            ? "bg-primary"
                            : "bg-gray-300"
                        }`}
                />

            </section> */}

            {/* Save */}
            <div className="flex justify-end">

                <Button
                    onClick={handleSave}
                    disabled={saving}
                >

                    {saving ? (
                        <>
                            <Loader2
                                className="animate-spin mr-2"
                                size={16}
                            />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} className="mr-2" />
                            Save Settings
                        </>
                    )}

                </Button>

            </div>

        </div>
    );
}
