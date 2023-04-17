import { useEffect, useState } from "react"

import { Link, useLocation, useParams } from "react-router-dom"
import { UNKNOWN_ID } from "@/helper/consts"
import { useGlobalStore } from "@/store/global"
import { useMemoStore } from '@/store/memo'
import {useUserStore} from '@/store/user'
import useLoading from "@/hooks/useLoading"
import MemoContent from "@/components/memo/MemoContent"
import MemoResources from "@/components/memo/MemoResources"
import { getDateTimeString } from "@/helper/datetime"

import { useNotification } from '@/components/notification'
import "./css/memo-detail.less"

interface State {
  memo: Memo;
}

function MemoDetail(){
  const params = useParams()
  const location = useLocation()
  const globalStore = useGlobalStore()
  const memoStore = useMemoStore()
  const userStore = useUserStore()

  const { addNotification } = useNotification()

  const [state, setState] = useState<State>({
    memo: {
      id: UNKNOWN_ID,
    } as Memo,
  })
  const loadingState = useLoading()
  const customizedProfile = globalStore.state.systemStatus.customizedProfile
  const user = userStore.state.user

  useEffect(() => {
    const memoId = Number(params.memoId)
    if (memoId && !isNaN(memoId)) {
      memoStore
        .fetchMemoById(memoId)
        .then((memo) => {
          setState({
            memo,
          });
          loadingState.setResolve()
        })
        .catch((error) => {
          console.error(error);
          addNotification({
            content:`memo[${params.memoId}]失败`
          })
        })
    }
  }, [location])

  return (
    <section className="page-wrapper memo-detail">
      <div className="page-container">
        <div className="page-header">
          <div className="title-container">
            <img className="h-10 w-auto rounded-lg mr-2" src={customizedProfile.logoUrl} alt="" />
            <p className="logo-text">{customizedProfile.name}</p>
          </div>
          <div className="action-button-container">
            {!loadingState.isPending && (
              <>
                {user ? (
                  <Link to="/" className="btn">
                    <span className="icon">🏠</span> {"返回主页"}
                  </Link>
                ) : (
                  <Link to="/auth" className="btn">
                    <span className="icon">👉</span> {"登录"}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
        {!loadingState.isPending && (
          <main className="memos-wrapper">
            <div className="memo-container">
              <div className="memo-header">
                <div className="status-container">
                  <span className="time-text">{getDateTimeString(state.memo.createdTs)}</span>
                  <a className="name-text" href={`/u/${state.memo.creatorId}`}>
                    @{state.memo.creatorName}
                  </a>
                </div>
              </div>
              <MemoContent className="memo-content" content={state.memo.content} showFull={true} onMemoContentClick={() => undefined} />
              <MemoResources resourceList={state.memo.resourceList} />
            </div>
          </main>
        )}
      </div>
    </section>
  );
};

export default MemoDetail;
