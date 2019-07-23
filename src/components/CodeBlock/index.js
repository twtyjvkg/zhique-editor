import React, { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import PropTypes from 'prop-types';

class CodeBlock extends Component {

    render() {
        const { value, language } = this.props;
        return (
            <SyntaxHighlighter
                language={language}
                style={docco}
                showLineNumbers
                wrapLines
            >
                {value}
            </SyntaxHighlighter>
        );
    }
}

CodeBlock.defaultProps = {
    language: '',
    value: ''
};

CodeBlock.propTypes = {
    value: PropTypes.string,
    language: PropTypes.string,
};

export default CodeBlock;