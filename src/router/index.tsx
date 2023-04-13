import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'

import { TOKENKEY } from '@/shared/constant'

const customLazy = (fn:any) => (lazy(() => new Promise((resolve) => {
    setTimeout(resolve, 1000)
}).then(v => fn)))

const Root = customLazy( import('@/pages/Root') )
const Auth = customLazy( import('@/pages/Auth') )

export default createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        loader:async () => {
            if(!localStorage.getItem(TOKENKEY)){
                return redirect('/auth')
            }
        }
    },
    {
        path:'/auth',
        element: <Auth />
    }
])