import React from 'react';
import { Helmet } from 'react-helmet';

const MetaData = ({ titre }) => {
  return (  
    <Helmet>
        <title>{titre+' - Dimma '}</title>
    </Helmet>
  )
}

export default MetaData