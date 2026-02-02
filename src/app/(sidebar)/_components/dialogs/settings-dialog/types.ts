export const settingsPages = ["general", "appearance", "models", "api-keys", "usage", "account"] as const
export type SettingsPage = (typeof settingsPages)[number]
