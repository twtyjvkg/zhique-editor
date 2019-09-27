import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';


class Code extends Component {

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

Code.defaultProps = {
    language: '',
    value: ''
};

Code.propTypes = {
    value: PropTypes.string,
    language: PropTypes.string,
};

export default Code;