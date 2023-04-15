type Locale = "en" | "zh" | "vi" | "fr" | "nl" | "sv" | "de" | "es" | "uk" | "ru" | "it" | "hant" | "tr" | "ko" | "sl";

type Appearance = "system" | "light" | "dark"

interface LocalSetting {
    enableDoubleClickEditing: boolean;
    dailyReviewTimeOffset: number;
}

interface Setting {
    locale: Locale;
    appearance: Appearance;
    memoVisibility: Visibility;
}