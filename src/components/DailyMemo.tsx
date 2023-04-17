import { getTimeString } from "@/helper/datetime"
import MemoContent from "./memo/MemoContent"
import MemoResources from "./memo/MemoResources"
import "./css/daily-memo.less"

interface Props {
  memo: Memo;
}

function DailyMemo(props: Props){
  const { memo } = props;
  const createdTimeStr = getTimeString(memo.createdTs);

  return (
    <div className="daily-memo-wrapper">
      <div className="time-wrapper">
        <span className="normal-text">{createdTimeStr}</span>
      </div>
      <div className="memo-container">
        <MemoContent content={memo.content} showFull={true} />
        <MemoResources resourceList={memo.resourceList} />
      </div>
      <div className="split-line"></div>
    </div>
  );
};

export default DailyMemo;
