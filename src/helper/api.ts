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

export function getResourceList<T>() {
    return customFetchHander<T>(fetch('/api/resource'))
}

export function getResourceListWithLimit<T>(resourceFind?: ResourceFind) {
    const queryList = [];
    if (resourceFind?.offset) {
        queryList.push(`offset=${resourceFind.offset}`);
    }
    if (resourceFind?.limit) {
        queryList.push(`limit=${resourceFind.limit}`);
    }
    return customFetchHander<T>(fetch(`/api/resource?${queryList.join("&")}`))
}

export function createResource<T>(resourceCreate: ResourceCreate) {
    return customFetchHander<Resource>(fetch("/api/resource", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resourceCreate)
    }))
}

export function createResourceWithBlob(formData: FormData) {
    return customFetchHander<Resource>(fetch("/api/resource/blob", {
        method: 'POST',
        body: formData
    }))
}

export function deleteResourceById(id: number) {
    return customFetchHander(fetch(`/api/resource/${id}`, {
        method: 'DELETE'
    }))
}

export function patchResource(resourcePatch: ResourcePatch) {
    return customFetchHander(fetch(`/api/resource/${resourcePatch.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ resourcePatch })
    }))
}

export function upsertMemoResource(memoId: MemoId, resourceId: ResourceId) {
    return customFetchHander<Resource>(fetch(`/api/memo/${memoId}/resource`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resourceId })
    }))
}

export function getMemoById(id: MemoId) {
    return customFetchHander<Memo>(fetch(`/api/memo/${id}`));
}

export function createMemo(memoCreate: MemoCreate) {
    return customFetchHander<Memo>(fetch("/api/memo", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(memoCreate)
    }))
}

export function patchMemo(memoPatch: MemoPatch) {
    return customFetchHander<Memo>(fetch(`/api/memo/${memoPatch.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(memoPatch)
    }))
}

export function pinMemo(memoId: MemoId) {
    return customFetchHander(fetch(`/api/memo/${memoId}/organizer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pinned: true,
        })
    }))
}

export function unpinMemo(memoId: MemoId) {
    return customFetchHander(fetch(`/api/memo/${memoId}/organizer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application'
        },
        body: JSON.stringify({
            pinned: false,
        })
    }))
}

export function deleteMemo(memoId: MemoId) {
    return customFetchHander(fetch(`/api/memo/${memoId}`, { method: 'DELETE' }))
}

export function getAllMemos(memoFind?: MemoFind) {
    const queryList = [];
    if (memoFind?.offset) {
        queryList.push(`offset=${memoFind.offset}`);
    }
    if (memoFind?.limit) {
        queryList.push(`limit=${memoFind.limit}`);
    }

    return customFetchHander<Memo[]>(fetch(`/api/memo/all?${queryList.join("&")}`))
}

export function getMemoList(memoFind?: MemoFind) {
    const queryList = [];
    if (memoFind?.creatorId) {
        queryList.push(`creatorId=${memoFind.creatorId}`);
    }
    if (memoFind?.rowStatus) {
        queryList.push(`rowStatus=${memoFind.rowStatus}`);
    }
    if (memoFind?.pinned) {
        queryList.push(`pinned=${memoFind.pinned}`);
    }
    if (memoFind?.offset) {
        queryList.push(`offset=${memoFind.offset}`);
    }
    if (memoFind?.limit) {
        queryList.push(`limit=${memoFind.limit}`);
    }
    return customFetchHander<Memo[]>(fetch(`/api/memo?${queryList.join("&")}`))
}

export function deleteMemoResource(memoId: MemoId, resourceId: ResourceId) {
    return customFetchHander(fetch(`/api/memo/${memoId}/resource/${resourceId}`,{
        method:'DELETE'
    }))
}

export function getTagList(tagFind?: TagFind) {
    const queryList = [];
    if (tagFind?.creatorId) {
        queryList.push(`creatorId=${tagFind.creatorId}`);
    }
    return customFetchHander<string[]>(fetch(`/api/tag?${queryList.join("&")}`))
}

export function upsertTag(tagName: string) {
    return customFetchHander<string>(fetch(`/api/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: tagName,
        })
    }))
}

export function deleteTag(tagName: string) {
    return customFetchHander<boolean>(fetch(`/api/tag/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: tagName,
        })
    }))
}

function customFetchHander<T>(promise: Promise<Response>) {
    return promise.then(async res => {
        if (res.status === 200) return Promise.resolve<ResponseRaw<T>>({ ...await res.json() })
        return Promise.resolve<ResponseRaw<T>>({ error: res.statusText })
    }, reason => {
        return Promise.resolve<ResponseRaw<T>>({ error: reason })
    })
}