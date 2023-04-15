export function getSystemColorScheme() {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    } else {
        return "light";
    }
}

export const isNullorUndefined = (value: any) => {
    return value === null || value === undefined;
};