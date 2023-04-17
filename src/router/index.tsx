import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'

import { initialGlobalState } from '@/store/global'
import { isNullorUndefined } from '@/helper/utils'
import store from '@/store'
import { initialUserState } from '@/store/user'

const customLazy = (fn: any) => (lazy(() => new Promise((resolve) => {
    setTimeout(resolve, 1000)
}).then(v => fn)))

const Auth = customLazy(import('@/pages/Auth'))
const Root = customLazy(import('@/pages/Root'))
const Home = customLazy(import('@/pages/Home'))
const MemoDetail = customLazy(import('@/pages/MemoDetail'))
const DailyReview = customLazy(import('@/pages/DailyReview'))
const ResourcesDashboard = customLazy(import('@/pages/ResourceDashboard'))
const Explore = customLazy(import('@/pages/Explore'))

const initialGlobalStateLoader = (() => {
    let done = false;

    return async () => {
        if (done) {
            return;
        }
        done = true;
        try {
            await initialGlobalState();
        } catch (error) {
            // do nth
        }
    }
})()

export default createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: "",
                element: <Home />,
                loader: async () => {
                    await initialGlobalStateLoader();
                    try {
                        await initialUserState();
                    } catch (error) {
                        // do nth
                    }

                    const { host, user } = store.getState().user;

                    if (isNullorUndefined(host)) {
                        return redirect("/auth");
                    } else if (isNullorUndefined(user)) {
                        return redirect("/explore");
                    }
                    return null;
                }
            },
            {
                path: "review",
                element: <DailyReview />,
                loader: async () => {
                    await initialGlobalStateLoader();

                    try {
                        await initialUserState();
                    } catch (error) {
                        // do nth
                    }

                    const { host } = store.getState().user;
                    if (isNullorUndefined(host)) {
                        return redirect("/auth");
                    }
                    return null;
                },
            },
            {
                path: "resources",
                element: <ResourcesDashboard />,
                loader: async () => {
                    await initialGlobalStateLoader();

                    try {
                        await initialUserState();
                    } catch (error) {
                        // do nth
                    }

                    const { host } = store.getState().user;
                    if (isNullorUndefined(host)) {
                        return redirect("/auth");
                    }
                    return null;
                },
            },
            {
                path: "explore",
                element: <Explore />,
                loader: async () => {
                    await initialGlobalStateLoader();

                    try {
                        await initialUserState();
                    } catch (error) {
                        // do nth
                    }

                    const { host } = store.getState().user;
                    if (isNullorUndefined(host)) {
                        return redirect("/auth");
                    }
                    return null;
                },
            }
        ]
    },
    {
        path: '/auth',
        element: <Auth />,
        loader: async () => {
            await initialGlobalStateLoader();
            return null;
        },
    },
    {
        path: '/memo/:memoId',
        element: <MemoDetail />,
        loader: async () => {
            await initialGlobalStateLoader()
            return null
        }
    }
])