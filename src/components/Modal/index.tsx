import { Modal as AntdModal } from "antd";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  loading: boolean;
  footer: any;
  open: boolean;
  width: number;
  onClose: () => void;
  onOke: () => void;
};

const Modal: React.FC<Props> = ({
  children,
  loading,
  title,
  footer,
  open,
  onClose,
  onOke,
  width,
}) => {
  return (
    <AntdModal
      title={title}
      confirmLoading={loading}
      open={open}
      onOk={onOke}
      width={width}
      onCancel={onClose}
      footer={footer}
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
