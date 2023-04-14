import * as storage from '@/helper/storage'
import { getSystemStatus } from '@/helper/api'
import store, { useAppSelector } from '@/store'
import { setAppearance, setGlobalState, setLocale } from './reduer/global'

export const initialGlobalState = async () => {
    const defaultGlobalState = {
        locale: "zh" as Locale,
        appearance: "system" as Appearance,
        systemStatus: {
            allowSignUp: false,
            ignoreUpgrade: false,
            disablePublicMemos: false,
            additionalStyle: "",
            additionalScript: "",
            customizedProfile: {
                name: "uamemos",
                logoUrl: "/vite.svg",
                description: "",
                locale: "zh",
                appearance: "system",
                externalUrl: ""
            },
        } as SystemStatus
    }

    const { locale: storageLocale, appearance: storageAppearance } = storage.get(["locale", "appearance"])
    defaultGlobalState.locale = storageLocale || "zh"
    defaultGlobalState.appearance = storageAppearance || "system"

    const { data, error } = await getSystemStatus()
    if (data) {
        const customizedProfile = data.customizedProfile
        defaultGlobalState.systemStatus = {
            ...data,
            customizedProfile: {
                name: customizedProfile.name || "uamemos",
                logoUrl: customizedProfile.logoUrl || "/vite.svg",
                description: customizedProfile.description,
                locale: customizedProfile.locale || "zh",
                appearance: customizedProfile.appearance || "system",
                externalUrl: "",
            }
        }
        defaultGlobalState.locale = storageLocale || "zh"
        defaultGlobalState.appearance = customizedProfile.appearance
    }
    store.dispatch(setGlobalState(defaultGlobalState))
}

export const useGlobalStore=()=>{
    const state = useAppSelector((state)=>state.global)
    return {
        state,
        getState: ()=>{
            return store.getState().global
        },
        isDev:()=>{
            return state.systemStatus.profile.mode !== "prod"
        },
        fetchSystemStatus:async () => {
            const {data:systemStatus} = (await getSystemStatus())
            store.dispatch(setGlobalState({systemStatus:systemStatus}))
            return systemStatus
        },
        setSystemStatus: (systemStatus: Partial<SystemStatus>)=>{
            store.dispatch(
                setGlobalState({
                    systemStatus:{
                        ...state.systemStatus,
                        ...systemStatus
                    }
                })
            )
        },
        setLocale:(locale:Locale)=>{
            store.dispatch(setLocale(locale))
        },
        setAppearance:(appearance:Appearance)=>{
            store.dispatch(setAppearance(appearance))
        }
    }
}