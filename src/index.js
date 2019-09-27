import React from 'react';
import PropTypes from 'prop-types';

import { Markdown, MarkdownEditor } from './components';

const ZhiQueEditor = ({ type, ...props }) => {
    switch (type) {
        case 'markdown-editor':
            return (
                <MarkdownEditor {...props} />
            );
        case 'markdown':
            return (
                <Markdown {...props} />
            );
        default:
            return (
                <div>123</div>
            );
    }
};

ZhiQueEditor.defaultProps = {
  type: 'markdown-editor',
};

ZhiQueEditor.propTypes = {
    type: PropTypes.oneOf(['markdown-editor', 'markdown'])
};

export default ZhiQueEditor;