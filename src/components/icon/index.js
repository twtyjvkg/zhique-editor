import React from 'react';

import './iconfont';

import './index.less';

const Icon = ({ type }) => (
    <svg className="zhique-icon" aria-hidden="true">
        <use xlinkHref={`#zhique-icon-${type}`}/>
    </svg>
);

export default Icon;