type ResponseRaw<T> = {
    data?: T;
    error?: string;
    message?: string;
};

export function signin(name: string, pass: string) {
    return customFetchHander<User>(fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            pass: pass
        })
    }))
}

export function signup(name: string, pass: string) {
    return customFetchHander<User>(fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            pass: pass
        })
    }))
}

export function signout() {
    return customFetchHander(fetch("/api/auth/signout", {
        method: 'POST'
    }))
}

export function getSelfUser() {
    return customFetchHander<User>(fetch("/api/user/me"))
}

export function getUserById(id: number) {
    return customFetchHander<User>(fetch(`/api/user/${id}`, {
        method: 'POST'
    }))
}

export function getSystemStatus() {
    return customFetchHander<SystemStatus>(fetch('/api/status'))
}

function customFetchHander<T>(promise: Promise<Response>) {
    return promise.then(async res => {
        if (res.status === 200) return Promise.resolve<ResponseRaw<T>>({ ...await res.json() })
        return Promise.resolve<ResponseRaw<T>>({ error: res.statusText })
    }, reason => {
        return Promise.resolve<ResponseRaw<T>>({ error: reason })
    })
}