import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete, Input, message } from 'antd';
import request from '../utils/request';
import Suffix from './Suffix';

function Typeahead(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const timeoutRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    if (props.value) {
      setValue(view(props.value));
    } else {
      setValue('');
    }
  }, [props.value]);

  const onVisibleChange = (visible) => {
    if (visible) {
      fetch(visible);
    }
  }

  const onSelect = (dirtIndex) => {
    const index = parseInt(dirtIndex);

    if (!isNaN(index)) {
      props.onChange?.(data[index]);
    }
  }

  const onSearch = (value) => {
    setValue(value || '');

    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetch(true, value || '');
    }, props.timeout || 500);
  }

  const fetch = (visible, descricao) => {
    if (!visible) {
      return setData([]);
    }

    setLoading(true);

    const { url, method = 'GET', params = {}, api = true } = props;

    params.descricao = descricao;

    const config = {
      method,
      params,
      api,
      body: null,
    }

    if (method !== 'GET') {
      config.body = params;

      delete config.params;
    }

    request(url, {
      ...config,
    }).then((data) => {
      setLoading(false);

      if (Array.isArray(data)) {
        setData(data);
      }
    }).catch((err) => {
      setLoading(false);

      if (props.onError) {
        props.onError(err);
      } else {
        message.error(err.message);
      }
    });
  }

  const view = (item) => {
    if (!item) {
      return '';
    }

    if (typeof props.view === 'string') {
      return item[props.view];
    }

    if (props.view) {
      return props.view(item);
    }

    if (item.descricao) {
      return item.descricao;
    }

    return Object.values(item)[0];
  }

  const formatDataSource = (item, index) => {
    return {
      label: view(item),
      value: index.toString(),
    }
  }

  const remove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (props.disabled) {
      return;
    }

    props.onChange?.(null);
    setData([]);
    autoCompleteRef.current.blur();
  }

  return (
    <AutoComplete value={value}
      ref={autoCompleteRef}
      defaultActiveFirstOption
      onSearch={onSearch}
      onSelect={onSelect}
      placeholder={props.placeholder}
      options={data.map(formatDataSource)}
      style={{ width: '100%', ...props.style }}
      disabled={props.disabled}
      onDropdownVisibleChange={onVisibleChange}>
      <Input spellCheck={false}
        suffix={
          <Suffix loading={loading}
            value={value}
            remove={remove} />
        }
      />
    </AutoComplete>
  );
}

export default Typeahead;