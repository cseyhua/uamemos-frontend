import { omit } from "lodash-es";
import * as api from "@/helper/api";
import { DEFAULT_MEMO_LIMIT } from "@/helper/consts";
import { useUserStore } from "./user";
import store, { useAppSelector } from ".";
import { createMemo, deleteMemo, patchMemo, setIsFetching, upsertMemos } from "./reduer/memo";

const convertResponseModelMemo = (memo: Memo): Memo => {
    return {
        ...memo,
        createdTs: memo.createdTs * 1000,
        updatedTs: memo.updatedTs * 1000,
    };
};

export const useMemoStore = () => {
    const state = useAppSelector((state) => state.memo)
    const userStore = useUserStore()

    const fetchMemos = async (limit = DEFAULT_MEMO_LIMIT, offset = 0) => {
        store.dispatch(setIsFetching(true))
        const memoFind: MemoFind = {
            rowStatus: "NORMAL",
            limit,
            offset,
        };
        // 如果是拜访者
        if (userStore.isVisitorMode()) {
            // 从路径获取用户ID，如果没有就为undefind
            memoFind.creatorId = userStore.getUserIdFromPath()
        }
        const { data } = (await api.getMemoList(memoFind))
        const fetchedMemos = data?.map((m) => convertResponseModelMemo(m)) || [] as Memo[];
        store.dispatch(upsertMemos(fetchedMemos));
        store.dispatch(setIsFetching(false));

        return fetchedMemos;
    }
    const fetchMemoById = async (memoId: MemoId) => {
        // 通过Memo ID获取memo数据
        const { data } = (await api.getMemoById(memoId))
        const memo = convertResponseModelMemo(data as Memo)
        return memo;
    }
    const getMemoById = async (memoId: MemoId) => {
        // 在本地存储中进行查找，如果存在直接返回，不存在则发起请求，远程请求回来
        let localFind = state.memos.find((memo) => memo.id === memoId)
        return localFind ?? await fetchMemoById(memoId)
    }

    return {
        state,
        fetchMemoById,
        getMemoById,
        fetchMemos,
        getState: () => {
            return store.getState().memo;
        },
        fetchAllMemos: async (limit = DEFAULT_MEMO_LIMIT, offset?: number) => {
            const memoFind: MemoFind = {
                rowStatus: "NORMAL",
                limit,
                offset,
            };

            const { data } = (await api.getAllMemos(memoFind));
            const memos = data?.map((m) => convertResponseModelMemo(m));
            return memos;
        },
        fetchArchivedMemos: async () => {
            const memoFind: MemoFind = {
                rowStatus: "ARCHIVED",
            };
            if (userStore.isVisitorMode()) {
                memoFind.creatorId = userStore.getUserIdFromPath();
            }
            const { data } = (await api.getMemoList(memoFind));
            const archivedMemos = data?.map((m) => {
                return convertResponseModelMemo(m);
            });
            return archivedMemos;
        },
        getLinkedMemos: async (memoId: MemoId): Promise<Memo[]> => {
            const regex = new RegExp(`[@(.+?)](${memoId})`);
            return state.memos.filter((m) => m.content.match(regex));
        },
        createMemo: async (memoCreate: MemoCreate) => {
            const { data } = (await api.createMemo(memoCreate));
            const memo = convertResponseModelMemo(data as Memo);
            store.dispatch(createMemo(memo));
            return memo;
        },
        patchMemo: async (memoPatch: MemoPatch): Promise<Memo> => {
            const { data } = (await api.patchMemo(memoPatch));
            const memo = convertResponseModelMemo(data as Memo);
            store.dispatch(patchMemo(omit(memo, "pinned")));
            return memo;
        },
        pinMemo: async (memoId: MemoId) => {
            await api.pinMemo(memoId);
            store.dispatch(
                patchMemo({
                    id: memoId,
                    pinned: true,
                })
            );
        },
        unpinMemo: async (memoId: MemoId) => {
            await api.unpinMemo(memoId);
            store.dispatch(
                patchMemo({
                    id: memoId,
                    pinned: false,
                })
            );
        },
        deleteMemoById: async (memoId: MemoId) => {
            await api.deleteMemo(memoId);
            store.dispatch(deleteMemo(memoId));
        },
    };
};
