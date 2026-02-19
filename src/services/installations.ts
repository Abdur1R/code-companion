import { api } from "@/lib/api";

export interface Repo {
  id: number;
  name: string;
  full_name: string;
}

export interface ReviewerConfig {
  aiModel: string;
  reviewStyle?: string;
  autoReview: boolean;
}

export interface InstallationSettingsRequest {
  user_id: string;
  selected_repos: Repo[];
  reviewer: ReviewerConfig;
}

export interface InstallationResponse {
  installationId: number;
  userId: string;
  selectedRepos: Repo[];
  reviewer: ReviewerConfig;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Save settings (POST)
 */
export async function saveInstallationSettings(
  installationId: number,
  data: InstallationSettingsRequest
) {
  return api.post(`/installations/${installationId}/settings`, data);
}

/**
 * Update settings (PUT)
 */
export async function updateInstallationSettings(
  installationId: number,
  data: Partial<InstallationSettingsRequest>
) {
  return api.put(`/installations/${installationId}/settings`, data);
}

/**
 * Get repos from database
 */
export async function getInstallation(
  installationId: number
): Promise<InstallationResponse | null> {
  try {
    return await api.get(`/installations/${installationId}`);
  } catch {
    return null;
  }
}

/**
 * Get repos from GitHub API
 */
export async function getInstallationRepos(installationId: number) {
  return api.get(`/api/repos/${installationId}`);
}

// Get user ID associated with installation
export async function getUserId(
  installationId: number
): Promise<InstallationResponse | null> {
  try {
    return await api.get(`/installations/${installationId}/info`);
  } catch {
    return null;
  }
}