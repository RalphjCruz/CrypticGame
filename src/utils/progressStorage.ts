import type { DashboardData, DraftData } from "../types/progress";

const DASHBOARD_STORAGE_KEY = "hangyos-dashboard-v1";
const DRAFT_STORAGE_KEY = "hangyos-drafts-v1";

const defaultDashboardData: DashboardData = {
  crypticEntries: [],
  sudokuEntries: [],
  crypticCompletedPuzzleIds: [],
  sudokuCompletedPuzzleIds: [],
};

const defaultDraftData: DraftData = {
  crypticAnswerDraft: "",
};

const isBrowser = (): boolean => typeof window !== "undefined" && !!window.localStorage;

export const loadDashboardData = (): DashboardData => {
  if (!isBrowser()) {
    return defaultDashboardData;
  }

  try {
    const raw = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!raw) {
      return defaultDashboardData;
    }

    const parsed = JSON.parse(raw) as Partial<DashboardData> | null;
    return {
      crypticEntries: parsed?.crypticEntries ?? [],
      sudokuEntries: parsed?.sudokuEntries ?? [],
      crypticCompletedPuzzleIds: parsed?.crypticCompletedPuzzleIds ?? [],
      sudokuCompletedPuzzleIds: parsed?.sudokuCompletedPuzzleIds ?? [],
    };
  } catch {
    return defaultDashboardData;
  }
};

export const saveDashboardData = (data: DashboardData): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(data));
};

export const loadDraftData = (): DraftData => {
  if (!isBrowser()) {
    return defaultDraftData;
  }

  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) {
      return defaultDraftData;
    }

    const parsed = JSON.parse(raw) as Partial<DraftData> | null;
    return {
      crypticAnswerDraft: parsed?.crypticAnswerDraft ?? "",
    };
  } catch {
    return defaultDraftData;
  }
};

export const saveDraftData = (data: DraftData): void => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
};
