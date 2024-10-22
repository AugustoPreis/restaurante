import React from 'react';
import Typeahead from '../../components/Typeahead';

export default function CategoriaProdutoTypeahead(props) {
  return (
    <Typeahead {...props}
      url='/categoria-produto'
      method='GET'
      view='descricao' />
  );
}