import { useEffect, useState } from "react";
import React from "react";
import { Button, Popconfirm, Table, message } from "antd";
import Layout from "../../components/Layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import {
  RANDOM,
  formatTime,
  transformDataWithKey,
} from "../../utils/custom.env";
import { commentService } from "../../services/comment.service";

interface DataType {
  key: React.Key;
  _id: any;
  userID: any;
  productID: any;
  rating: any;
  comment: any;
  createdAt: Date;
  formatTime: () => void;
}

type Props = {
  setLoadingBarProgress: any;
};

const CommentPage: React.FC<Props> = ({ setLoadingBarProgress }) => {
  useEffect(() => {
    setLoadingBarProgress(RANDOM.generateRandomNumber());
    setTimeout(() => {
      setLoadingBarProgress(100);
    }, RANDOM.timeout);
  }, []);
  const queryClient = useQueryClient();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const deleteCommentMutation = useMutation(
    (data) => commentService.fetchDeleteComment(data),
    {
      onSuccess: (response) => {
        if (response.status === true) {
          message.success(`${response.message}`);
        } else {
          message.error(`${response.message}`);
        }
        queryClient.invalidateQueries(["comments"]);
      },
      onError: (error) => {
        console.error(error);
        message.error(`${error}`);
      },
    }
  );

  const confirmDelete = (id: any) => {
    deleteCommentMutation.mutate(id);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      render: (text, record, index) => index + 1,
    },
    {
      title: "USER",
      sorter: true,
      render: (record: DataType) => (
        <p className="font-medium uppercase">{record.userID.fullname}</p>
      ),
    },
    {
      title: "PRODUCT",
      sorter: true,
      render: (record: DataType) => (
        <p className="font-medium uppercase">{record.productID.nameProduct}</p>
      ),
    },
    {
      title: "RATING",
      sorter: true,
      render: (record: DataType) => (
        <>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: record.rating }).map((_, index: any) => (
              <svg
                key={index}
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
              >
                <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
              </svg>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "CONTENT",
      dataIndex: "comment",
      sorter: true,
    },
    {
      title: "TIME",
      sorter: true,
      render: (record: DataType, index: any) => (
        <p key={index} className="font-medium uppercase">
          {formatTime(record.createdAt)}
        </p>
      ),
    },
    {
      title: "ACTION",
      render: (record: DataType, index: any) => (
        <div>
          <Popconfirm
            key={`delete-${index}`}
            title="Delete the comment"
            description="Are you sure to delete this comment?"
            placement="topLeft"
            onConfirm={() => confirmDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button
              key={`delete-btn-${index}`}
              className="font-medium text-red-600 dark:text-blue-500 hover:underline"
            >
              Delete
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // const onChange: TableProps<DataType>["onChange"] = (
  //   pagination,
  //   filters,
  //   sorter,
  //   extra
  // ) => {
  //   // console.log("params", pagination, filters, sorter, extra);
  // };

  const { data: isComment, isLoading } = useQuery(
    ["comments"],
    () => commentService.fetchAllComments(),
    {
      retry: 3,
      retryDelay: 1000,
    }
  );

  const transformedData = transformDataWithKey(isComment); // custom id to key

  return (
    <Layout>
      <div className="flex justify-between">
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            className="bg-blue-500"
            disabled={!hasSelected}
          >
            Delete
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected
              ? `Selected delete ${selectedRowKeys.length} items`
              : ""}
          </span>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        bordered={true}
        columns={columns}
        loading={isLoading}
        dataSource={transformedData}
        size={"small"}
      />
    </Layout>
  );
};
export default CommentPage;
