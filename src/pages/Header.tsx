type Props = {
    className?:string
}

function Header(props:Props){
    return (
        <div className={props.className}>
            Header
        </div>
    )
}

export default Header