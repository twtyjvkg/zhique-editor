import React, { PureComponent } from 'react';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror';
import 'codemirror/lib/codemirror.css';

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';

import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';

import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/selection/mark-selection';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/groovy/groovy';

import './index.less';

class CodeEditor extends PureComponent{

    constructor(props) {
        super(props);
        const { value } = props;
        this.editorArea = React.createRef();
        this.state = {
            text: value || ''
        };
    }


    componentDidMount() {
        this.init();
    }

    init = () => {
        const { options, fontSize, codeMirrorProps } = this.props;
        const editorArea = this.editorArea.current;
        const codeEditor = CodeMirror.fromTextArea(
            editorArea,
            {...options, ...codeMirrorProps}
        );
        const {
            display: {
                scroller,
                wrapper
            }
        } = codeEditor;
        wrapper.style.fontSize = fontSize;
        this.editor = codeEditor;
        this.scroller = scroller;
        this.wrapper = wrapper;
        this.initListener();
    };

    initListener = () => {
        const codeEditor = this.editor;
        const codeWrapper = this.wrapper;
        codeEditor.on('change', (cm, changeObj) =>this.handleChange(cm, changeObj));
        codeWrapper.addEventListener('mouseover', this.cmBindScroll);
        codeWrapper.addEventListener('touchstart', this.cmBindScroll);
        codeWrapper.addEventListener('mouseout', this.cmUnbindScroll);
        codeWrapper.addEventListener('touchend', this.cmUnbindScroll);
    };

    cmBindScroll = () => {
      this.scroller.addEventListener('scroll', this.cmScroll);
    };

    cmUnbindScroll = () => {
        this.scroller.removeEventListener('scroll', this.cmScroll);
    };

    cmScroll = e => {
        const {
            clientHeight: height,
            scrollTop,
            scrollHeight
        } = e.currentTarget;
        const percent = scrollTop / scrollHeight;
        const { onScroll } = this.props;
        if (onScroll) onScroll(scrollTop, scrollHeight, height, percent);
    };

    handleChange = (cm, changeObj) => {
        const { onChange } = this.props;
        if (onChange) onChange(cm.getValue());
    };


    render() {

        const { text } = this.state;

        return (
            <textarea ref={this.editorArea} defaultValue={text} />
        );
    }
}

CodeEditor.defaultProps = {
    fontSize: '13px',
    options: {
        mode: 'gfm',
        theme: 'default',
        lineWrapping: true,
        lineNumbers: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        matchBrackets: true,
        autofocus: true,
        autoCloseBrackets: true,
        matchTags: true,
        autoCloseTags: true,
        styleActiveLine: true,
        styleSelectedText: true
    },
};

export default CodeEditor;