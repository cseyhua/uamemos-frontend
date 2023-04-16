
import { useMemoStore } from '@/store/memo';
import './css/memo-list.less'
import { useUserStore } from '@/store/user';
import { useFilterStore } from '@/store/filter';
import { useEffect, useState } from 'react';
import { useShortcutStore } from '@/store/shortcut';
import { checkShouldShowMemoWithFilters } from '@/helper/filter';
import { LINK_REG, TAG_REG } from '@/labs/marked/parser';
import { getTimeStampByDate } from '@/helper/datetime';
import Memo from './Memo';
import { DEFAULT_MEMO_LIMIT } from '@/helper/consts';
import { useNotification } from '@/components/notification'

function MemoList() {

    const memoStore = useMemoStore()
    const userStore = useUserStore()
    const shortcutStore = useShortcutStore()
    const filterStore = useFilterStore()
    const filter = filterStore.state
    const { memos, isFetching } = memoStore.state
    const [isComplete, setIsComplete] = useState<boolean>(false)

    const { addNotification } = useNotification()

    const currentUserId = userStore.getCurrentUserId()
    const { tag: tagQuery, duration, type: memoType, text: textQuery, shortcutId, visibility } = filter
    const shortcut = shortcutId ? shortcutStore.getShortcutById(shortcutId) : null

    const showMemoFilter = Boolean(tagQuery || (duration && duration.from < duration.to) || memoType || textQuery || shortcut || visibility)

    // 对memo进行各种过滤
    const shownMemos = (
        showMemoFilter || shortcut
            ? memos.filter((memo) => {
                let shouldShow = true;

                if (shortcut) {
                    const filters = JSON.parse(shortcut.payload) as Filter[];
                    if (Array.isArray(filters)) {
                        shouldShow = checkShouldShowMemoWithFilters(memo, filters as Filter[]);
                    }
                }
                if (tagQuery) {
                    const tagsSet = new Set<string>();
                    for (const t of Array.from(memo.content.match(new RegExp(TAG_REG, "g")) ?? [])) {
                        const tag = t.replace(TAG_REG, "$1").trim();
                        const items = tag.split("/");
                        let temp = "";
                        for (const i of items) {
                            temp += i;
                            tagsSet.add(temp);
                            temp += "/";
                        }
                    }
                    if (!tagsSet.has(tagQuery)) {
                        shouldShow = false;
                    }
                }
                if (
                    duration &&
                    duration.from < duration.to &&
                    (getTimeStampByDate(memo.createdTs) < duration.from || getTimeStampByDate(memo.createdTs) > duration.to)
                ) {
                    shouldShow = false;
                }
                if (memoType) {
                    if (memoType === "NOT_TAGGED" && memo.content.match(TAG_REG) !== null) {
                        shouldShow = false;
                    } else if (memoType === "LINKED" && memo.content.match(LINK_REG) === null) {
                        shouldShow = false;
                    }
                }
                if (textQuery && !memo.content.toLowerCase().includes(textQuery.toLowerCase())) {
                    shouldShow = false;
                }
                if (visibility) {
                    shouldShow = memo.visibility === visibility;
                }

                return shouldShow;
            })
            : memos
    ).filter((memo) => memo.creatorId === currentUserId);

    // 排序比较函数
    const memoSort = (mi: Memo, mj: Memo) => {
        return mj.createdTs - mi.createdTs;
    }
    // 固定的Memo显示在前面，并且所有memo按时序排列
    const pinnedMemos = shownMemos.filter((m: Memo) => m.pinned)
    const unpinnedMemos = shownMemos.filter((m: Memo) => !m.pinned)
    pinnedMemos.sort(memoSort)
    unpinnedMemos.sort(memoSort)
    const sortedMemos = pinnedMemos.concat(unpinnedMemos).filter((m) => m.rowStatus === "NORMAL")

    useEffect(() => {
        memoStore
            .fetchMemos()
            .then((fetchedMemos) => {
                if (fetchedMemos.length < DEFAULT_MEMO_LIMIT) {
                    setIsComplete(true);
                } else {
                    setIsComplete(false);
                }
            })
            .catch((error) => {
                console.log(error)
                addNotification({
                    content: "请求memos错误",
                    type: 'ERROR'
                })
            });
    }, [currentUserId])

    useEffect(() => {
        const pageWrapper = document.body.querySelector(".page-wrapper");
        if (pageWrapper) {
            pageWrapper.scrollTo(0, 0)
        }
    }, [filter])

    useEffect(() => {
        if (isFetching || isComplete) {
          return;
        }
        if (sortedMemos.length < DEFAULT_MEMO_LIMIT) {
          handleFetchMoreClick();
        }
      }, [isFetching, isComplete, filter, sortedMemos.length])

    const handleFetchMoreClick = async () => {
        try {
            const fetchedMemos = await memoStore.fetchMemos(DEFAULT_MEMO_LIMIT, memos.length);
            if (fetchedMemos.length < DEFAULT_MEMO_LIMIT) {
                setIsComplete(true);
            } else {
                setIsComplete(false);
            }
        } catch (error: any) {
            addNotification({
                content: "请求memos错误",
                type: 'ERROR'
            })
        }
    }

    return (
        <div className="memo-list-container">
            {/* 显示所有Memo */}
            {sortedMemos.map((memo: Memo) => (
                <Memo key={`${memo.id}-${memo.createdTs}`} memo={memo} />
            ))}
            {/* 是否还在请求 */}
            {isFetching ? (
                <div className="status-text-container fetching-tip">
                    <p className="status-text">{"FETCHING"}</p>
                </div>
            ) : (
                <div className="status-text-container">
                    <p className="status-text">
                        {isComplete ? (
                            sortedMemos.length === 0 ? (
                                "NOMEMOS"
                            ) : (
                                "MEMOSREADY"
                            )
                        ) : (
                            <>
                                <span className="cursor-pointer hover:text-green-600" onClick={handleFetchMoreClick}>
                                    {"FETCHMORE"}
                                </span>
                            </>
                        )}
                    </p>
                </div>
            )}
        </div>
    )
}

export default MemoList