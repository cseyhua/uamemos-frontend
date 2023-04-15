type UserId = number;
type UserRole = "HOST" | "USER";

interface User {
    id: UserId;

    createdTs: TimeStamp;
    updatedTs: TimeStamp;
    rowStatus: RowStatus;

    username: string;
    role: UserRole;
    email: string;
    nickname: string;
    openId: string;
    avatarUrl: string;
    userSettingList: UserSetting[];

    setting: Setting;
    localSetting: LocalSetting;
}