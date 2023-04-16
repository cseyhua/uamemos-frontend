import { getRelativeTimeString } from "@/helper/datetime";
import { useEditorStore } from "@/store/editor";
import { useFilterStore } from "@/store/filter";
import { useMemoStore } from "@/store/memo";
import { useUserStore } from "@/store/user";
import { useRef, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from '@/components/notification'

import './css/memo.less'
import Icon from "./Icon";
import MemoContent from "./MemoContent";
import MemoResources from "./MemoResources";

interface Props {
    memo: Memo;
    readonly?: boolean;
}

function Memo(props: Props) {

    const { memo, readonly } = props
    const navigate = useNavigate()
    const editorStore = useEditorStore()
    const filterStore = useFilterStore()
    const userStore = useUserStore()
    const memoStore = useMemoStore()

    const { addNotification } = useNotification()

    const [createdTimeStr, setCreatedTimeStr] = useState<string>(getRelativeTimeString(memo.createdTs))
    const memoContainerRef = useRef<HTMLDivElement>(null)
    const isVisitorMode = userStore.isVisitorMode() || readonly

    // 进入详情页面
    const handleViewMemoDetailPage = () => {
        navigate(`/memo/${memo.id}`);
    }

    // 置顶按钮被按下
    const handleTogglePinMemoBtnClick = async () => {
        try {
            if (memo.pinned) {
                await memoStore.unpinMemo(memo.id);
            } else {
                await memoStore.pinMemo(memo.id);
            }
        } catch (error) {
            // do nth  
        }
    }

    // 编辑按钮被按下
    const handleEditMemoClick = () => {
        editorStore.setEditMemoWithId(memo.id);
    }

    // 归档按钮被按下
    const handleArchiveMemoClick = async () => {
        try {
            await memoStore.patchMemo({
                id: memo.id,
                rowStatus: "ARCHIVED",
            });
        } catch (error: any) {
            addNotification({ content: error.response.data.message, type: 'ERROR' })
        }

        if (editorStore.getState().editMemoId === memo.id) {
            editorStore.clearEditMemo();
        }
    }

    // 删除按钮被按下
    const handleDeleteMemoClick = async () => {
        // showCommonDialog({
        //   title: t("memo.delete-memo"),
        //   content: t("memo.delete-confirm"),
        //   style: "warning",
        //   dialogName: "delete-memo-dialog",
        //   onConfirm: async () => {
        //     await memoStore.deleteMemoById(memo.id);
        //   },
        // });
    }

    // 共享Memo
    const handleGenerateMemoImageBtnClick = () => {
        // showShareMemo(memo);
    }

    // 处理内容被点击，过滤标签、todoitem、图片
    const handleMemoContentClick = async (e: React.MouseEvent) => {
        const targetEl = e.target as HTMLElement;

        if (targetEl.className === "tag-span") {
            const tagName = targetEl.innerText.slice(1);
            const currTagQuery = filterStore.getState().tag;
            if (currTagQuery === tagName) {
                filterStore.setTagFilter(undefined);
            } else {
                filterStore.setTagFilter(tagName);
            }
        } else if (targetEl.classList.contains("todo-block")) {
            if (isVisitorMode) {
                return;
            }

            const status = targetEl.dataset?.value;
            const todoElementList = [...(memoContainerRef.current?.querySelectorAll(`span.todo-block[data-value=${status}]`) ?? [])];
            for (const element of todoElementList) {
                if (element === targetEl) {
                    const index = todoElementList.indexOf(element);
                    const tempList = memo.content.split(status === "DONE" ? /- \[x\] / : /- \[ \] /);
                    let finalContent = "";

                    for (let i = 0; i < tempList.length; i++) {
                        if (i === 0) {
                            finalContent += `${tempList[i]}`;
                        } else {
                            if (i === index + 1) {
                                finalContent += status === "DONE" ? "- [ ] " : "- [x] ";
                            } else {
                                finalContent += status === "DONE" ? "- [x] " : "- [ ] ";
                            }
                            finalContent += `${tempList[i]}`;
                        }
                    }
                    await memoStore.patchMemo({
                        id: memo.id,
                        content: finalContent,
                    });
                }
            }
        } else if (targetEl.tagName === "IMG") {
            const imgUrl = targetEl.getAttribute("src");
            if (imgUrl) {
                // showPreviewImageDialog([imgUrl], 0);
            }
        }
    }

    const handleMemoContentDoubleClick = (e: React.MouseEvent) => {
        if (isVisitorMode) {
            return;
        }

        const loginUser = userStore.state.user;
        if (loginUser && !loginUser.localSetting.enableDoubleClickEditing) {
            return;
        }
        const targetEl = e.target as HTMLElement;

        if (targetEl.className === "tag-span") {
            return;
        } else if (targetEl.classList.contains("todo-block")) {
            return;
        }

        editorStore.setEditMemoWithId(memo.id);
    }

    const handleMemoCreatedTimeClick = (e: React.MouseEvent) => {
        if (e.altKey) {
            e.preventDefault();
            // showChangeMemoCreatedTsDialog(memo.id)
        }
    }

    const handleMemoVisibilityClick = (visibility: Visibility) => {
        const currVisibilityQuery = filterStore.getState().visibility;
        if (currVisibilityQuery === visibility) {
            filterStore.setMemoVisibilityFilter(undefined);
        } else {
            filterStore.setMemoVisibilityFilter(visibility);
        }
    }

    return (
        <div className={`memo-wrapper ${"memos-" + memo.id} ${memo.pinned ? "pinned" : ""}`} ref={memoContainerRef}>
            <div className="memo-top-wrapper">
                <div className="status-text-container">
                    <Link className="time-text" to={`/memo/${memo.id}`} onClick={handleMemoCreatedTimeClick}>
                        {createdTimeStr}
                    </Link>
                    {isVisitorMode && (
                        <Link className="name-text" to={`/u/${memo.creatorId}`}>
                            @{memo.creatorName}
                        </Link>
                    )}
                </div>
                {!isVisitorMode && (
                    <div className="btns-container space-x-2">
                        {memo.visibility !== "PRIVATE" && (
                            <></>
                            // <Tooltip title={t(`memo.visibility.${memo.visibility.toLowerCase()}`)} side="top">
                            //     <div onClick={() => handleMemoVisibilityClick(memo.visibility)}>
                            //         {memo.visibility === "PUBLIC" ? (
                            //             <Icon.Globe2 className="w-4 h-auto cursor-pointer rounded text-green-600" />
                            //         ) : (
                            //             <Icon.Users className="w-4 h-auto cursor-pointer rounded text-gray-500 dark:text-gray-400" />
                            //         )}
                            //     </div>
                            // </Tooltip>
                        )}
                        {memo.pinned && <Icon.Bookmark className="w-4 h-auto rounded text-green-600" />}
                        <span className="btn more-action-btn">
                            <Icon.MoreHorizontal className="icon-img" />
                        </span>
                        <div className="more-action-btns-wrapper">
                            <div className="more-action-btns-container">
                                <div className="w-full flex flex-row justify-between px-3 py-2 mb-1 border-b dark:border-zinc-700">
                                    {/* <Tooltip title={memo.pinned ? t("common.unpin") : t("common.pin")} side="top">
                                        <div onClick={handleTogglePinMemoBtnClick}>
                                            {memo.pinned ? (
                                                <Icon.Bookmark className="w-4 h-auto cursor-pointer rounded text-green-600" />
                                            ) : (
                                                <Icon.BookmarkPlus className="w-4 h-auto cursor-pointer rounded dark:text-gray-400" />
                                            )}
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={t("common.edit")} side="top">
                                        <Icon.Edit3 className="w-4 h-auto cursor-pointer rounded dark:text-gray-400" onClick={handleEditMemoClick} />
                                    </Tooltip>
                                    <Tooltip title={t("common.share")} side="top">
                                        <Icon.Share
                                            className="w-4 h-auto cursor-pointer rounded dark:text-gray-400"
                                            onClick={handleGenerateMemoImageBtnClick}
                                        />
                                    </Tooltip> */}
                                </div>
                                <span className="btn" onClick={handleViewMemoDetailPage}>
                                    {"查看详细"}
                                </span>
                                <span className="btn text-orange-500" onClick={handleArchiveMemoClick}>
                                    {"归档"}
                                </span>
                                <span className="btn text-red-600" onClick={handleDeleteMemoClick}>
                                    {"删除"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <MemoContent
                content={memo.content}
                onMemoContentClick={handleMemoContentClick}
                onMemoContentDoubleClick={handleMemoContentDoubleClick}
            />
            <MemoResources resourceList={memo.resourceList} />
        </div>
    )
}

export default memo(Memo)