interface StorageData {
    // Editor content cache
    editorContentCache: string;
    // Editing memo id cache
    editingMemoIdCache: MemoId;
    // locale
    locale: Locale;
    // appearance
    appearance: Appearance;
    // local setting
    localSetting: LocalSetting;
    // skipped version
    skippedVersion: string;
}


type StorageKey = keyof StorageData;

export function get(keys: StorageKey[]):Partial<StorageData> {
    const data:Partial<StorageData> = {}

    for(const key of keys){
        try{
            const stringifyValue = localStorage.getItem(key)
            if(stringifyValue !== null){
                const val = JSON.parse(stringifyValue)
                data[key] = val
            }
        }catch(err){
            console.error("Get storage failed in ", key, err)
        }
    }

    return data
}