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
    faItalic, faQuoteLeft, faListUl, faListOl, faMinus, faLink
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

    wordsFirstUpperCase = str => {
        return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, item => item.toUpperCase());
    };

    initToolbarMenu = () => {

        const { classPrefix } = this.props;
        const menuList = [
            {
                title: '撤销（Ctrl+Z）',
                icon: faUndo,
                onClick: (editor) => {
                    editor.focus();
                    editor.undo();
                }
            },
            {
                title: '重做（Ctrl+Y）',
                icon: faRedo,
                onClick: (editor) => {
                    editor.focus();
                    editor.redo();
                }
            },
            '|',
            {
                title: '粗体',
                icon: faBold,
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    editor.replaceSelection(`**${selection}**`);
                    if ('' === selection) {
                        editor.setCursor(cursor.line, cursor.ch+2);
                    }
                }
            },
            {
                title: '删除线',
                icon: faStrikethrough,
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    editor.replaceSelection(`~~${selection}~~`);

                    if(selection === '') {
                        editor.setCursor(cursor.line, cursor.ch + 2);
                    }
                }
            },
            {
                title: '斜体',
                icon: faItalic,
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    editor.replaceSelection(`*${selection}*`);
                    if ('' === selection) {
                        editor.setCursor(cursor.line, cursor.ch+1);
                    }
                }
            },
            {
                title: '引用',
                icon: faQuoteLeft,
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`> ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 2);
                    } else {
                        editor.replaceSelection(`> ${selection}`)
                    }
                }
            },
            {
                title: '将每个单词首字母转成大写',
                text: 'Aa',
                onClick: (editor) => {
                    editor.focus();
                    const selection = editor.getSelection();
                    const selections = editor.listSelections();
                    editor.replaceSelection(this.wordsFirstUpperCase(selection));
                    editor.setSelections(selections);
                }
            },
            {
                title: '将所选转换成大写',
                text: 'A',
                onClick: (editor) => {
                    editor.focus();
                    const selection = editor.getSelection();
                    const selections = editor.listSelections();
                    editor.replaceSelection(selection.toUpperCase());
                    editor.setSelections(selections);
                }
            },
            {
                title: '将所选转换成小写',
                text: 'a',
                onClick: (editor) => {
                    editor.focus();
                    const selection = editor.getSelection();
                    const selections = editor.listSelections();
                    editor.replaceSelection(selection.toLowerCase());
                    editor.setSelections(selections);
                }
            },
            '|',
            {
                title: '标题1',
                text: 'h1',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`# ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 2);
                    } else {
                        editor.replaceSelection(`# ${selection}`);
                    }
                }
            },
            {
                title: '标题2',
                text: 'h2',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`## ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 3);
                    } else {
                        editor.replaceSelection(`## ${selection}`);
                    }
                }
            },
            {
                title: '标题3',
                text: 'h3',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`### ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 4);
                    } else {
                        editor.replaceSelection(`### ${selection}`);
                    }
                }
            },
            {
                title: '标题4',
                text: 'h4',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`#### ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 5);
                    } else {
                        editor.replaceSelection(`#### ${selection}`);
                    }
                }
            },
            {
                title: '标题5',
                text: 'h5',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`##### ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 6);
                    } else {
                        editor.replaceSelection(`##### ${selection}`);
                    }
                }
            },
            {
                title: '标题6',
                text: 'h6',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    if (cursor.ch !== 0) {
                        editor.setCursor(cursor.line, 0);
                        editor.replaceSelection(`###### ${selection}`);
                        editor.setCursor(cursor.line, cursor.ch + 7);
                    } else {
                        editor.replaceSelection(`###### ${selection}`);
                    }
                }
            },
            '|',
            {
                title: '无序列表',
                icon: faListUl,
                onClick: (editor) => {
                    editor.focus();
                    const selection = editor.getSelection();
                    if (selection === '') {
                        editor.replaceSelection(`- ${selection}`)
                    } else {
                        let selectionText = selection.split('\n');
                        selectionText = selectionText.map(item => item === '' ? '' : `- ${item}`);
                        editor.replaceSelection(selectionText.join('\n'));
                    }
                }
            },
            {
                title: '有序列表',
                icon: faListOl,
                onClick: (editor) => {
                    editor.focus();
                    const selection = editor.getSelection();
                    if (selection === '') {
                        editor.replaceSelection(`1. ${selection}`)
                    } else {
                        let selectionText = selection.split('\n');
                        selectionText = selectionText.map((item, index) => item === '' ? '' : `${index + 1}. ${item}`);
                        editor.replaceSelection(selectionText.join('\n'));
                    }
                }
            },
            {
                title: '横线',
                icon: faMinus,
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    editor.replaceSelection(`${cursor.ch !== 0 ? '\n\n' : '\n'}------------\n\n`)
                }
            },
            '|',
            {
                title: '链接',
                icon: faLink,
                onClick: (editor) => {
                    editor.focus();

                }
            }
        ];

        return (
            <ul className={`${classPrefix}-menu`}>
                {menuList.map(item => {
                    if (typeof item === 'string') {
                        return <li className="divider">{item}</li>
                    } else {
                        const { icon, title, text, onClick } = item;
                        return (
                            <li
                                onClick={() => onClick(this.codeEditor.current.editor)}
                            >
                                <a>
                                    <i className="fa" title={title}>
                                        {icon && <FontAwesomeIcon icon={icon} />}{text && <b>{text}</b>}
                                    </i>
                                </a>
                            </li>
                        )
                    }
                })}
            </ul>
        )
    };

    render() {

        const {
            classPrefix,
            width,
            height,
        } = this.props;

        const { text } = this.state;
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
                        {this.initToolbarMenu()}
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
