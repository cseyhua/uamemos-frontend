import styled from "styled-components";

const Row = styled.div
`
    display:flex;
    flex-direction:column;
    justifyContent:${ (props:any) => props.jc || 'flex-start'};
`

export default Row