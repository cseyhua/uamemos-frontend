import { useState } from "react"

const useLoading = (initialState = true) => {
    const [loading, setLoading] = useState({
        isPending: initialState,
        isResolve: false,
        isReject: false
    })
    return {
        ...loading,
        setPending: ()=>{
            setLoading({
                isPending:true, isResolve:false, isReject:false
            })
        },
        setResolve: ()=>{
            setLoading({
                isPending:false,isResolve:true,isReject:false
            })
        },
        setReject: ()=>{
            setLoading({
                isPending:false,isResolve:false, isReject:true
            })
        }
    }
}

export default useLoading