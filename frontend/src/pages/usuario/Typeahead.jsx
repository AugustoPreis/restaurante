import React from 'react';
import Typeahead from '../../components/Typeahead';

export default function UsuarioTypeahead(props) {
  return (
    <Typeahead {...props}
      url='/usuario'
      method='GET'
      view='nome' />
  );
}