import { Loader } from 'lucide-react'
import styled, {keyframes} from 'styled-components'

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const Spring = styled(Loader)`
animation: ${rotate} 2s linear infinite;
color: blue;
`

function Loading(props:any){
    return <div className={props.className}><Spring/></div>
}

export default styled(Loading)({
    display: 'flex',
    justifyContent: 'center',
})