import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
} from '@fortawesome/free-regular-svg-icons';
import {
    faUndo,
    faRedo,
    faBold,
    faStrikethrough,
    faItalic
} from '@fortawesome/free-solid-svg-icons';

import CodeMirror from 'codemirror';
import MarkDown from '../MarkDown';

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

import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/groovy/groovy';

import './index.less';

class MarkdownEditor extends PureComponent {

    constructor(props) {
        super(props);
        const {
            width,
            height,
            value,
        } = props;
        this.state = {
            _width: width,
            _height: height,
            text: value || '',
        };
        this.editor = React.createRef();
        this.preview = React.createRef();
        this.previewContainer = React.createRef();
        this.toolbar = React.createRef();
    }



    componentDidMount() {
        this.initCodeEditor();
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    initCodeEditor =() => {
        const { options, fontSize } = this.props;
        const editor = this.editor.current;
        const codeEditor = this.codeEditor = CodeMirror.fromTextArea(editor.querySelector('textarea'), options);
        const codeMirror = this.codeMirror = editor.querySelector('.CodeMirror');
        const { text } = this.state;
        if (text !== '') codeEditor.setValue(text);
        codeMirror.style.fontSize = fontSize;
        codeMirror.style.width = '50%';
    };

    handleResize = () => {
        const { clientWidth, clientHeight } = this.editor.current;
        const toolbar = this.toolbar.current;
        const codeMirror = this.codeMirror;
        const preview = this.preview.current;
        const previewContainer = this.previewContainer.current;
        previewContainer.style.padding = '20px';
        if (toolbar) {
            preview.style.top = `${toolbar.clientHeight + 1}px`;
            preview.style.width = `${clientWidth/2}px`;
            preview.style.height = `${clientHeight-toolbar.clientHeight}px`;
            codeMirror.style.height = `${clientHeight}px`;
            codeMirror.style.marginTop = toolbar ? `${toolbar.clientHeight + 1}px` : 0;
        }
    };

    handleChange = value => {
        this.setState({
            text: value
        });

        const { onChange } = this.props;
        if (onChange) {
            onChange(value);
        }
    };

    previewScroll = (top, scrollHeight, height, percent) => {
        const preview = this.preview.current;
        if (top === 0) {
            preview.scrollTop = 0
        } else if (top + height >= scrollHeight - 16) {
            preview.scrollTop = scrollHeight;
        } else {
            preview.scrollTop = scrollHeight * percent;
        }
    };

    previewBindScroll = e => {
        e.currentTarget.addEventListener('scroll', this.cmScroll)
    };

    previewUnbindScroll = e => {
        e.currentTarget.removeEventListener('scroll', this.cmScroll)
    };

    cmScroll = e => {
        const {
            clientHeight: height,
            scrollTop,
            scrollHeight
        } = e.currentTarget;
        const percent = scrollTop / scrollHeight;
        const editor = this.editor.current;
        const codeView = editor.querySelector('.CodeMirror-scroll');
        if (scrollTop === 0) {
            codeView.scrollTop = 0;
        } else if (scrollTop + height >= scrollHeight) {
            codeView.scrollTop = scrollHeight;
        } else {
            codeView.scrollTop = scrollHeight * percent;
        }
    };

    render() {

        const {
            classPrefix,
            width,
            height,
        } = this.props;

        const { text } = this.state;
        const ToolbarMenu = ({ icon, title, text, onClick }) => (
            <li
                onClick={e => onClick(e, this.codeEditor)}
            >
                <a>
                    <i className="fa" title={title}>{icon && <FontAwesomeIcon icon={icon} />}{text}</i>
                </a>
            </li>
        );
        return (
            <div
                className={classPrefix}
                style={{ width, height }}
                ref={this.editor}
            >
                <textarea id="test" />
                <div
                    className={classNames(`${classPrefix}-preview`)}
                    ref={this.preview}
                    onMouseOver={this.previewBindScroll}
                    onTouchStart={this.previewBindScroll}
                    onMouseOut={this.previewUnbindScroll}
                    onTouchEnd={this.previewUnbindScroll}
                >
                    <div
                        className={classNames('markdown-body', `${classPrefix}preview-container`)}
                        ref={this.previewContainer}
                    >
                        <MarkDown
                            value={text}
                        />
                    </div>
                </div>
                <div className={`${classPrefix}-toolbar`} ref={this.toolbar}>
                    <div className={`${classPrefix}-toolbar-container`}>
                        <ul className={`${classPrefix}-menu`}>
                            <ToolbarMenu
                                title="撤销（Ctrl+Z）"
                                icon={faUndo}
                                onClick={(e, editor) => {
                                    editor.focus();
                                    editor.undo();
                                }}
                            />
                            <ToolbarMenu
                                title="重做（Ctrl+Y）"
                                icon={faRedo}
                                onClick={(e, editor) => {
                                    editor.focus();
                                    editor.redo();
                                }}
                            />
                            <li className="divider">|</li>
                            <ToolbarMenu
                                title="粗体"
                                icon={faBold}
                                onClick={(e, editor) => {
                                    editor.focus();
                                    const cursor = editor.getCursor();
                                    const selection = editor.getSelection();
                                    editor.replaceSelection(`**${selection}**`);
                                    if ('' === selection) {
                                        editor.setCursor(cursor.line, cursor.ch+2);
                                    }
                                }}
                            />
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

MarkdownEditor.defaultProps = {
    width: '90%',
    height: 500,
    classPrefix: 'zhique-markdown',
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
    },
    fontSize: '13px',
};

MarkdownEditor.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    classPrefix: PropTypes.string
};

export default MarkdownEditor;
