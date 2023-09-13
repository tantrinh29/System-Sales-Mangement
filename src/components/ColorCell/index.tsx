import React from "react";

type Props = {
  values: any;
};

const ColorCell: React.FC<Props> = ({ values }) => {
  return (
    
    <div className="flex">
      {values?.map((color: any, index: number) => (
        <span
          key={index}
          className="inline-block bg-blue-500 text-white text-xs py-1 px-2 rounded-full mr-1"
        >
          {color.nameColor}
        </span>
      ))}
    </div>
  );
};
export default ColorCell;
