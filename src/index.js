import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Markdown, MarkdownEditor } from './components';

class ZhiQueEditor extends Component {

    render() {
        const { type, ...props } = this.props;
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
    }
}

ZhiQueEditor.defaultProps = {
  type: 'markdown-editor',
};

ZhiQueEditor.propTypes = {
    type: PropTypes.oneOf(['markdown-editor', 'markdown'])
};

export default ZhiQueEditor;