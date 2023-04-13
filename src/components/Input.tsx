import { ChangeEventFunction } from "@/shared";
import styled from "styled-components";

const Input = styled.input({
    margin: '0.25em 0',
    padding: '1em 0.25em 0.25em 0.55em',
    fontSize: '1.25em',
    border: '2px solid #303030',
    borderRadius: '0.25em',
    backgroundColor: "transparent",
    color: '#a0a0a0',
    ":focus": {
        outline: '2px solid green'
    }
})

const Div = styled.label`
display: block;
position: relative;
`

const Span = styled.span`
position:absolute;
top: 0;
left: 0.75em;
transform: translateY(20%);
color: #707070;
font-size: 1em;
`

type Props = {
    placeholder?: string,
    tip?:string,
    type?: string,
    name?:string,
    value?:string,
    onChange?:ChangeEventFunction,
    required?:boolean
}

function InputBox(props: Props) {
    return (
        <Div>
            {props.placeholder && <Span>{props.tip}</Span>}
            <Input {...props} />
        </Div>
    )
}

export default InputBox