import { useEffect, useRef, useState } from "react"
import { marked } from "@/labs/marked"
import Icon from "../Icon"
import "@/components/css/memo-content.less"

const MAX_EXPAND_HEIGHT = 384

interface Props {
  content: string;
  className?: string;
  showFull?: boolean;
  onMemoContentClick?: (e: React.MouseEvent) => void;
  onMemoContentDoubleClick?: (e: React.MouseEvent) => void;
}

type ExpandButtonStatus = -1 | 0 | 1;

interface State {
  expandButtonStatus: ExpandButtonStatus;
}

function MemoContent(props: Props){
  const { className, content, showFull, onMemoContentClick, onMemoContentDoubleClick } = props;

  const [state, setState] = useState<State>({
    expandButtonStatus: -1,
  })
  const memoContentContainerRef = useRef<HTMLDivElement>(null)

  // 首次挂载的时候执行，当内容高度大于最大高度的时候，显示一个可扩展的按钮
  useEffect(() => {
    if (showFull) {
      return;
    }

    if (memoContentContainerRef.current) {
      const height = memoContentContainerRef.current.clientHeight;
      if (height > MAX_EXPAND_HEIGHT) {
        setState({
          expandButtonStatus: 0,
        });
      }
    }
  }, []);

  const handleMemoContentClick = async (e: React.MouseEvent) => {
    if (onMemoContentClick) {
      onMemoContentClick(e);
    }
  };

  const handleMemoContentDoubleClick = async (e: React.MouseEvent) => {
    if (onMemoContentDoubleClick) {
      onMemoContentDoubleClick(e);
    }
  };

  const handleExpandBtnClick = () => {
    const expandButtonStatus = Boolean(!state.expandButtonStatus);
    setState({
      expandButtonStatus: Number(expandButtonStatus) as ExpandButtonStatus,
    });
  };

  return (
    <div className={`memo-content-wrapper ${className || ""}`}>
      <div
        ref={memoContentContainerRef}
        className={`memo-content-text ${state.expandButtonStatus === 0 ? "max-h-64 overflow-y-hidden" : ""}`}
        onClick={handleMemoContentClick}
        onDoubleClick={handleMemoContentDoubleClick}
      >
        {marked(content)}
      </div>
      {/* 可伸长按钮 */}
      {state.expandButtonStatus !== -1 && (
        <div className={`expand-btn-container ${state.expandButtonStatus === 0 && "!-mt-7"}`}>
          <div className="absolute top-0 left-0 w-full h-full blur-lg bg-white dark:bg-zinc-700"></div>
          <span className={`btn z-10 ${state.expandButtonStatus === 0 ? "expand" : "fold"}`} onClick={handleExpandBtnClick}>
            {state.expandButtonStatus === 0 ? ("expand") : ("fold")}
            <Icon.ChevronRight className="icon-img opacity-80" />
          </span>
        </div>
      )}
    </div>
  );
};

export default MemoContent;
