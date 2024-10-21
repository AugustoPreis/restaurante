import React from 'react';

export default function Label({ title, children, extra }) {

  return (
    <span>
      <div style={{ color: 'rgba(0, 0, 0, 0.85)', marginBottom: 5 }}>
        {title}
      </div>
      <div style={{ marginBottom: 10 }}>
        {children}
      </div>
      {extra ? (
        <div style={{ marginTop: -5 }}>
          {extra}
        </div>
      ) : null}
    </span>
  );
}