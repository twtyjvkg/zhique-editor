import React, { PureComponent } from 'react';
import ReactMarkdown from 'react-markdown';

import CodeBlock from '../CodeBlock';

import 'github-markdown-css/github-markdown.css';

class MarkDown extends PureComponent{

    render() {

        const { value, ...props } = this.props;
        return (
            <ReactMarkdown
                source={value}
                renderers={{
                    code: CodeBlock
                }}
                {...props}
            />
        );
    }
}

MarkDown.defaultProps = {
    escapeHtml: false
};

export default MarkDown;