
const MAX_EXPAND_HEIGHT = 384;

interface Props {
  content: string;
  className?: string;
  showFull?: boolean;
  onMemoContentClick?: (e: React.MouseEvent) => void;
  onMemoContentDoubleClick?: (e: React.MouseEvent) => void;
}

function MemoContent(props:Props){
    return (
        <div></div>
    )
}

export default MemoContent