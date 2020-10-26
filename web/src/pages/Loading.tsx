import React from 'react';
import ReactLoading from 'react-loading';

import '../styles/pages/loading.css';

function Loading() {
  return (
    <div id="page-loading">
      <div className="content-wrapper">
        <ReactLoading type="spinningBubbles" color="#FFF" />
      </div>
    </div>
  );
}

export default Loading;