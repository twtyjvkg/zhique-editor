import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Controlled as CodeMirror2 } from 'react-codemirror2';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/groovy/groovy';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';

import './CodeMirror.less';

class CodeMirror extends PureComponent{

    constructor(props) {
        super(props);
        const { value } = props;
        this.state = {
            text: value || '',
        };
        this.codeMirror = React.createRef();
        this.editor = null;
    }

    componentDidMount() {
        const codeMirror = this.codeMirror.current.ref;
        codeMirror.addEventListener('mouseover', this.cmBindScroll);
        codeMirror.addEventListener('mouseout', this.cmUnbindScroll);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            const { width, height, fontSize } = this.props;
            this.codeMirror.current.ref.style.width = typeof width === 'string' ? width : `${width}px`;
            this.codeMirror.current.ref.style.height = typeof height === 'string' ? height : `${height}px`;
            this.codeMirror.current.ref.style.fontSize = fontSize;
        }
    }

    handleBeforeChange = (editor, data, value) => {
        this.setState({
            text: value,
        });
    };

    handleChange = (editor, data, value) => {
        const { onChange} = this.props;
        if (onChange) onChange(value);
    };

    cmBindScroll = e => {
        const codeView = e.currentTarget.querySelector('.CodeMirror-scroll');
        codeView.addEventListener('scroll', this.cmScroll)
    };

    cmUnbindScroll = e => {
        const codeView = e.currentTarget.querySelector('.CodeMirror-scroll');
        codeView.removeEventListener('scroll', this.cmScroll);
    };

    cmScroll = e => {
        const {
            offsetHeight: height,
            scrollTop,
            scrollHeight
        } = e.currentTarget;
        const percent = scrollTop / scrollHeight;
        const { onScroll } = this.props;
        if (onScroll) onScroll(scrollTop, scrollHeight, height, percent);
    };

    render() {

        const {
            options,
        } = this.props;
        const { text } = this.state;

        return (
            <CodeMirror2
                options={options}
                value={text}
                ref={this.codeMirror}
                editorDidMount={(editor) => {
                    editor.setSize('100%', '100%');
                    editor.focus();
                    this.editor = editor;
                }}
                onBeforeChange={this.handleBeforeChange}
                onChange={this.handleChange}
            />
        )
    }
}

CodeMirror.defaultProps = {
    options: {
        mode: 'gfm',
        theme: 'default',
        lineWrapping: true,
        lineNumbers: true,
    },
    fontSize: '13px',
};

export default CodeMirror;