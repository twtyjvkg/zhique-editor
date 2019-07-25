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

import CodeEditor from '../CodeEditor';
import MarkDown from '../MarkDown';

import './index.less';

class MarkdownEditor extends PureComponent {

    constructor(props) {
        super(props);
        const {
            value
        } = props;
        this.state = {
            text: value || '',
        };
        this.editor = React.createRef();
        this.codeEditor = React.createRef();
        this.preview = React.createRef();
        this.previewContainer = React.createRef();
        this.toolbar = React.createRef();
    }



    componentDidMount() {
        this.init();
    }

    init = () => {
        const editor = this.editor.current;
        const { clientWidth, clientHeight } = editor;
        const toolbar = this.toolbar.current;
        const preview = this.preview.current;
        const previewContainer = this.previewContainer.current;
        const codeWrapper = this.codeEditor.current.wrapper;
        previewContainer.style.padding = '20px';
        if (toolbar) {
            preview.style.width = `${(clientWidth+1)/2}px`;
            preview.style.height = `${clientHeight-toolbar.clientHeight}px`;
            preview.style.top = `${toolbar.clientHeight + 1}px`;
            codeWrapper.style.width = `${(clientWidth+1)/2}px`;
            codeWrapper.style.height = `${clientHeight-toolbar.clientHeight}px`;
            codeWrapper.style.marginTop = toolbar ? `${toolbar.clientHeight + 1}px` : 0;
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
        const codeScroller = this.codeEditor.current.scroller;
        if (scrollTop === 0) {
            codeScroller.scrollTop = 0;
        } else if (scrollTop + height >= scrollHeight) {
            codeScroller.scrollTop = scrollHeight;
        } else {
            codeScroller.scrollTop = scrollHeight * percent;
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
                onClick={e => onClick(e, this.codeEditor.current.editor)}
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
                <CodeEditor
                    ref={this.codeEditor}
                    value={text}
                    onChange={this.handleChange}
                    onScroll={this.previewScroll}
                />
                <div
                    className={`${classPrefix}-preview`}
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
    classPrefix: 'zhique-markdown',
    width: '90%',
    height: 500
};

MarkdownEditor.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    classPrefix: PropTypes.string
};

export default MarkdownEditor;
