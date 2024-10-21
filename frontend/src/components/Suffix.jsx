import React from 'react';
import { LoadingOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';

function Suffix({ loading, value, remove }) {
  let icon = (
    <DownOutlined />
  );

  if (loading) {
    icon = (
      <LoadingOutlined />
    );
  } else if (value) {
    icon = (
      <div>
        <CloseOutlined onMouseDown={remove} />
      </div>
    );
  }

  return (
    <span>
      {icon}
    </span>
  );
}

export default Suffix;