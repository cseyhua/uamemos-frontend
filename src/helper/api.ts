type ResponseRaw<T> = {
    data?: T;
    error?: string;
    message?: string;
};

export function signin(name: string, pass: string) {
    return fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            pass: pass
        })
    }).then(res => {
        console.log(res.status,res)
    })
}

export function getSystemStatus(){
    return customFetchHander<SystemStatus>(fetch('/api/status'))
}

function customFetchHander<T>(promise:Promise<Response>){
    return promise.then(async res=>{
        if(res.status === 200)return Promise.resolve<ResponseRaw<T>>({data: await res.json()})
        return Promise.resolve<ResponseRaw<T>>({error:res.statusText})
    }, reason=>{
        return Promise.resolve<ResponseRaw<T>>({error:reason})        
    })
}