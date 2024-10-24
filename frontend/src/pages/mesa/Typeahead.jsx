import React from 'react';
import Typeahead from '../../components/Typeahead';

export default function MesaTypeahead(props) {
  return (
    <Typeahead {...props}
      url='/mesa'
      method='GET'
      view='descricao' />
  );
}