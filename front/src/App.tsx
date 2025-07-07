import React from 'react';
import { Button, Upload, message } from 'antd';
import type { UploadProps, UploadFile, GetProp } from 'antd';
import './App.css';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

function App() {
  const [list, setList] = React.useState<
    { id: number; fileurl: string; filepath: string }[]
  >([]);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [uploading, setUploading] = React.useState(false);

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((fileList) => [...fileList, file]);
      return false;
    },
    fileList,
  };
  React.useEffect(() => {
    refreshList();
  }, []);
  function refreshList() {
    fetch('/api/upload')
      .then((res) => res.json())
      .then((value) => setList(value));
  }
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append(
        'files',
        new Blob([file as FileType], { type: file.type }),
        encodeURIComponent(file.name),
      );
      // formData.append('files', file as FileType);
    });
    setUploading(true);
    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setFileList([]);
        refreshList();
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };
  return (
    <>
      <Upload {...props}>
        <Button type="primary">选择文件</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
      <ul>
        {list.map((each) => (
          <li key={each.id}>
            <a href={each.fileurl}>{each.filepath}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
