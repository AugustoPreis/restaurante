
import React from 'react';
import { InputNumber } from 'antd';

export default function MoneyInput(props) {
  return (
    <InputNumber {...props}
      prefix='R$'
      min={0}
      style={{ width: '100%' }}
      controls={false}
      precision={2}
      decimalSeparator=',' />
  )
}