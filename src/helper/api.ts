import useSwr from 'swr'

export function signin(name: string, pass: string) {
    return fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: name,
            password: pass
        })
    }).then(res => {
        if(res.ok)return res.json()
        return Promise.resolve({message: res.statusText})
    }).then(data => Promise.resolve(data)).catch(err => Promise.reject({ error: err }))
}