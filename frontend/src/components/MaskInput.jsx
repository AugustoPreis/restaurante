import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const presets = {
  cpf: {
    regex: /(\d{3})(\d{3})(\d{3})(\d{2})/,
    replace: '$1.$2.$3-$4',
  },
  cnpj: {
    regex: /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    replace: '$1.$2.$3/$4-$5',
  },
  cep: {
    regex: /(\d{5})(\d{3})/,
    replace: '$1-$2',
  },
}

export default function MaskInput({
  regex,
  valueClear,
  replace,
  value,
  preset,
  formatter,
  maxLength,
  ...props
}) {
  const [formattedValue, setFormattedValue] = useState();

  useEffect(() => {
    setFormattedValue(format());
  }, [value]);

  const format = () => {
    let nValue = value?.toString();

    if (!nValue?.trim()) {
      return '';
    }

    if (nValue.length > maxLength) {
      nValue = nValue.slice(0, maxLength);
    }

    if (formatter) {
      return formatter(nValue);
    }

    let regExp = regex;
    let replaceValue = replace;

    if (presets[preset]) {
      regExp = presets[preset].regex;
      replaceValue = presets[preset].replace;
    } else if (!regex || !replace) {
      return nValue;
    }

    return nValue.trim().replace(regExp, replaceValue);
  }

  const onChange = (e) => {
    const regex = valueClear || /[^0-9]/g;

    e.target.value = e.target.value?.replace(regex, '')?.slice(0, maxLength);

    props.onChange?.(e);
  }

  return (
    <Input {...props}
      value={formattedValue}
      onChange={onChange} />
  );
}