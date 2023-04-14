interface Profile {
    mode: string;
    version: string;
}

interface SystemStatus {
    host?: User;
    profile: Profile;
    dbSize: number;
    // System settings
    allowSignUp: boolean;
    ignoreUpgrade: boolean;
    disablePublicMemos: boolean;
    additionalStyle: string;
    additionalScript: string;
    customizedProfile: CustomizedProfile;
    storageServiceId: number;
    localStoragePath: string;
}