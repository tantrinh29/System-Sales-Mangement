import React from "react";
import { Image, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type Props = {
  data: any;
  onRemove: any;
};

const ListImage: React.FC<Props> = ({ data, onRemove }) => {
  return (
    <div className="flex gap-3 justify-around mt-4">
      {data?.map((item: any, index: number) => (
        <div className="pb-2" key={index}>
          <Image
            className="rounded pb-2"
            width={200}
            src={item.length ? item : item.url || item.preview}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => onRemove(item)}
          />
        </div>
      ))}
    </div>
  );
};
export default ListImage;
