import { camelCase } from "lodash-es";

import * as api from '@/helper/api'
import store, { useAppSelector } from '.'
import { setHost, setUser, setUserById } from './reduer/user'
import { getSystemColorScheme } from '@/helper/utils';
import * as storage from '@/helper/storage'
import { setAppearance, setLocale } from "./reduer/global";

const defaultSetting: Setting = {
    locale: "en",
    appearance: getSystemColorScheme(),
    memoVisibility: "PRIVATE",
};

const defaultLocalSetting: LocalSetting = {
    enableDoubleClickEditing: true,
    dailyReviewTimeOffset: 0,
};

export const convertResponseModelUser = (user: User): User => {
    const setting: Setting = {
        ...defaultSetting,
    };
    const { localSetting: storageLocalSetting } = storage.get(["localSetting"]);
    const localSetting: LocalSetting = {
        ...defaultLocalSetting,
        ...storageLocalSetting,
    };

    if (user.userSettingList) {
        for (const userSetting of user.userSettingList) {
            (setting as any)[camelCase(userSetting.key)] = JSON.parse(userSetting.value);
        }
    }

    return {
        ...user,
        setting,
        localSetting,
        createdTs: user.createdTs * 1000,
        updatedTs: user.updatedTs * 1000,
    };
};

const doSignIn = async () => {
    const { data: user, error } = await api.getSelfUser()
    if (user) {
        store.dispatch(setUser(convertResponseModelUser(user)))
    } else {
        doSignOut()
    }
    return user
}

const doSignOut = async () => {
    await api.signout();
};

const getUserIdFromPath = () => {
    const pathname = window.location.pathname;
    const userIdRegex = /^\/u\/(\d+).*/;
    const result = pathname.match(userIdRegex);
    if (result && result.length === 2) {
        return Number(result[1]);
    }
    return undefined;
};

export const initialUserState = async () => {
    const { systemStatus } = store.getState().global;
  
    if (systemStatus.host) {
      store.dispatch(setHost(convertResponseModelUser(systemStatus.host)));
    }
  
    const { data } = (await api.getSelfUser());
    if (data) {
      const user = convertResponseModelUser(data);
      store.dispatch(setUser(user));
      if (user.setting.locale) {
        store.dispatch(setLocale(user.setting.locale));
      }
      if (user.setting.appearance) {
        store.dispatch(setAppearance(user.setting.appearance));
      }
    }
  };

export const useUserStore = () => {
    return {
        doSignIn,
        doSignOut,
    }
}
