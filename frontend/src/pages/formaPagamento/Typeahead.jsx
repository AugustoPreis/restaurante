import React from 'react';
import Typeahead from '../../components/Typeahead';

export default function FormaPagamentoTypeahead(props) {
  return (
    <Typeahead {...props}
      url='/forma-pagamento'
      method='GET'
      view='descricao' />
  );
}