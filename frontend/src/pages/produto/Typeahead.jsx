import React from 'react';
import Typeahead from '../../components/Typeahead';

export default function ProdutoTypeahead(props) {
  return (
    <Typeahead {...props}
      url='/produto'
      method='GET'
      view='nome' />
  );
}