import styled from "styled-components"

import { Column } from "@/layouts"
import Header from "@/pages/Header"
import { Outlet } from "react-router-dom"

const HeaderRaw = styled(Header)`
position: sticky;
top:0;
width: 200px;
padding:1em;
`

const RootRaw = styled(Column)`
width: 100%;
margin: 0 auto;

@media (min-width: 768px) {
    width: 768px;
}

@media (min-width: 1280px) {
    width: 1280px;
}
`

const Main = styled.div`
flex-grow:1;
`

function Root() {
    return (
        <RootRaw>
            <div>
                <HeaderRaw />
            </div>
            <Main>
                <Outlet />
            </Main>
        </RootRaw>
    )
}

export default Root