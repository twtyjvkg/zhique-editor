import React, { Component } from 'react';
import highlight from 'highlight.js';
import PropTypes from 'prop-types';

import 'highlight.js/styles/darcula.css';

class CodeBlock extends Component {

    componentDidMount() {
        this.highlightCode();
    }

    componentDidUpdate() {
        this.highlightCode();
    }

    setRef = el => {
        this.codeEl = el;
    };

    highlightCode = () => {
        highlight.highlightBlock(this.codeEl);
    };

    render() {
        const { value, language } = this.props;
        return (
            <pre>
                <code ref={this.setRef} className={`language-${language}`}>
                    {value}
                </code>
             </pre>
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
