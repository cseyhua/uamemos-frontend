import Icon from "@/components/Icon";
import { generateDialog } from "./BaseDialog";
import "@/components/css/dialog.less";

type DialogStyle = "info" | "warning";

interface Props extends DialogProps {
  title: string;
  content: string;
  style?: DialogStyle;
  closeBtnText?: string;
  confirmBtnText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

const defaultProps = {
  title: "",
  content: "",
  style: "info",
  closeBtnText: "common.close",
  confirmBtnText: "common.confirm",
  onClose: () => null,
  onConfirm: () => null,
};

function CommonDialog(props: Props){
  const { title, content, destroy, closeBtnText, confirmBtnText, onClose, onConfirm, style } = {
    ...defaultProps,
    closeBtnText: (defaultProps.closeBtnText),
    confirmBtnText: (defaultProps.confirmBtnText),
    ...props,
  };

  const handleCloseBtnClick = () => {
    onClose();
    destroy();
  };

  const handleConfirmBtnClick = async () => {
    onConfirm();
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">{title}</p>
        <button className="btn close-btn" onClick={handleCloseBtnClick}>
          <Icon.X />
        </button>
      </div>
      <div className="dialog-content-container">
        <p className="content-text">{content}</p>
        <div className="btns-container">
          <span className="btn cancel-btn" onClick={handleCloseBtnClick}>
            {closeBtnText}
          </span>
          <span className={`btn confirm-btn ${style}`} onClick={handleConfirmBtnClick}>
            {confirmBtnText}
          </span>
        </div>
      </div>
    </>
  );
};

interface CommonDialogProps {
  title: string;
  content: string;
  className?: string;
  style?: DialogStyle;
  dialogName: string;
  closeBtnText?: string;
  confirmBtnText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

export const showCommonDialog = (props: CommonDialogProps) => {
  generateDialog(
    {
      className: `common-dialog ${props?.className ?? ""}`,
      dialogName: `common-dialog ${props?.className ?? ""}`,
    },
    CommonDialog,
    props
  );
};
