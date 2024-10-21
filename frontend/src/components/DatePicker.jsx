import React from 'react';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generatePicker from 'antd/es/date-picker/generatePicker';
import ptBR from 'antd/es/date-picker/locale/pt_BR';
import 'antd/es/date-picker/style/index';

const Picker = generatePicker(dateFnsGenerateConfig);

function DatePicker(props) {
  let value = null;

  if (props.value) {
    value = new Date(props.value);
  }

  return (
    <Picker {...props}
      value={value}
      locale={ptBR} />
  );
}

function RangePicker(props) {
  let value = null;

  if (Array.isArray(props.value) && props.value.length === 2) {
    const [inicio, fim] = props.value;

    value = [new Date(inicio), new Date(fim)];
  }

  return (
    <Picker.RangePicker {...props}
      value={value}
      locale={ptBR} />
  );
}

function TimePicker(props) {
  let value = null;

  if (props.value) {
    value = new Date(props.value);
  }

  return (
    <Picker.TimePicker {...props}
      value={value}
      locale={ptBR} />
  );
}

export { RangePicker, TimePicker };
export default DatePicker;