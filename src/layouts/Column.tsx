import styled from "styled-components";

export default styled.div`
    display: flex;
    flexDirection: row;
    justifyContent: ${(props: any) => props.jc || 'flex-start'};
    gap: ${(props:any)=> props.gap || '1em'};
`