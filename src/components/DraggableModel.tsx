import React, { useRef, useState } from "react";
import { Button, Modal } from "antd";
import type { DraggableData, DraggableEvent } from "react-draggable";
import Draggable from "react-draggable";
import { PlusOutlined } from "@ant-design/icons";

interface Props {
  children?: React.ReactNode;
  OkButtontext: string;
  modalTitle?: string;
  modalOpenButtonText?: string;
  onSubmit: (params?: any) => void;
  open: boolean;
  width: string | number | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  initialvalues?: any;
  addButtonIcon?: React.ReactNode;
  addButtonType?:
    | "default"
    | "link"
    | "primary"
    | "text"
    | "dashed"
    | undefined;
  buttonType?: "Button" | "Link";
  disabledModalOpenButton?:boolean
}

const DraggableModel: React.FC<Props> = ({
  children,
  OkButtontext = "ok",
  modalTitle,
  modalOpenButtonText = "open",
  onSubmit = () => console.log("submitted"),
  open,
  setOpen,
  width,
  isLoading,
  initialvalues,
  addButtonIcon = <PlusOutlined />,
  addButtonType = "default",
  buttonType,
  disabledModalOpenButton
}) => {
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef<HTMLDivElement>(null);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    setOpen(false);
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      {buttonType ? (
        buttonType == "Button" ? (
          <Button onClick={showModal} icon={addButtonIcon} type={addButtonType} >
            {modalOpenButtonText}
          </Button>
        ) : (
          <a onClick={showModal} type="primary" >
            {modalOpenButtonText}
          </a>
        )
      ) : initialvalues ? (
        disabledModalOpenButton ? <span style={{color:"#d9d9d9"}}>{modalOpenButtonText}</span> : 
        <a onClick={showModal} type="primary">
          {modalOpenButtonText}
        </a>
      ) : (
        <Button onClick={showModal} icon={addButtonIcon} type={addButtonType}>
          {modalOpenButtonText}
        </Button>
      )}

      <Modal
        title={
          <div
            style={{ width: "100%", cursor: "move" }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            {modalTitle}
          </div>
        }
        okText={OkButtontext}
        open={open}
        onOk={onSubmit}
        okButtonProps={{ loading: isLoading }}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            nodeRef={draggleRef}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
        width={width}
      >
        {children}
      </Modal>
    </>
  );
};

export default DraggableModel;
