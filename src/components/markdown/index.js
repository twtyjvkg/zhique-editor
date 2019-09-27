import React, { PureComponent } from 'react';
import ReactMarkdown  from 'react-markdown';

import { Root, Image, Code } from './renderer';

import 'github-markdown-css/github-markdown.css';

class Markdown extends PureComponent {

    render() {
        const { value, className, ...props } = this.props;
        return (
            <ReactMarkdown
                className={className}
                source={value}
                linkTarget="_blank"
                renderers={{
                    root: Root,
                    code: Code,
                    image: Image,
                }}
                {...props}
            />
        )
    }
}

Markdown.defaultProps = {
  className: 'markdown-body'
};

export default Markdown;