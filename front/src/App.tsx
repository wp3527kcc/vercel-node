import React from 'react';
import { Button, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import './App.css';

function App() {
  const props: UploadProps = {
    name: 'file',
    action: '/upload',
    headers: {
      // authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        refreshList();
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const [list, seList] = React.useState<{ Key: string }[]>([]);
  React.useEffect(() => {
    refreshList();
  }, []);
  function refreshList() {
    fetch('/upload')
      .then((res) => res.json())
      .then((value) => seList(value));
  }
  return (
    <>
      <Upload {...props}>
        <Button type="primary">Hello World</Button>
      </Upload>
      <ul>
        {list.map((each) => (
          <li>
            <a href="/file/${each.Key}">{each.Key}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
