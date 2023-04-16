import styled from "styled-components"
import Header from "@/pages/Header"
import { Outlet } from "react-router-dom"

const HeaderRaw = styled(Header)`
position: sticky;
top:0;
width: 200px;
padding:1em;
`

function Root() {
    return (
        <div className="w-full min-h-full bg-zinc-100 dark:bg-zinc-800">
            <div className="w-full max-w-6xl mx-auto flex flex-row justify-center items-start">
                <Header />
                <main className="w-auto flex-grow flex flex-col justify-start items-start">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Root