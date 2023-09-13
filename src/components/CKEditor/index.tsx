import { CKEditor as Huydev } from "ckeditor4-react";
import React from "react";

type Props = {
  value: any;
  onChange: any;
  initialData: any;
};

const CKEditor: React.FC<Props> = ({ initialData, value, onChange }) => {
  return (
    <Huydev
      initData={initialData}
      data={value}
      onChange={onChange}
      onInit={(editor: any) => {
        editor.editing.view.change((writer: any) => {
          writer.setStyle(
            "height",
            "100px",
            editor.editing.view.document.getRoot()
          );
        });
      }}
    />
  );
};
export default CKEditor;
