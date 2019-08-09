import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import {
    faImage,
    faClock,
    faNewspaper
} from '@fortawesome/free-regular-svg-icons';
import {
    faUndo,
    faRedo,
    faBold,
    faStrikethrough,
    faItalic,
    faQuoteLeft,
    faListUl,
    faListOl,
    faMinus,
    faLink,
    faAnchor,
    faCode,
    faTable,
    faTerminal,
    faArrowsAlt
} from '@fortawesome/free-solid-svg-icons';

import CodeEditor from '../CodeEditor';
import MarkDown from '../MarkDown';

import Dialog from '../../plugins/Dialog';

import './index.less';

class MarkdownEditor extends PureComponent {

    constructor(props) {
        super(props);
        const {
            value,
            watch,
            fullScreen
        } = props;
        this.state = {
            text: value || '',
            watch,
            fullScreen
        };
        this.editor = React.createRef();
        this.codeEditor = React.createRef();
        this.preview = React.createRef();
        this.previewContainer = React.createRef();
        this.toolbar = React.createRef();
        this.dialog = React.createRef();
    }

    componentDidMount() {
        this.resize();
    }

    resize = () => {
        const { width, height } = this.props;
        const { fullScreen, watch } = this.state;
        const editor = this.editor.current;
        const toolbar = this.toolbar.current;
        const preview = this.preview.current;
        const previewContainer = this.previewContainer.current;
        const codeWrapper = this.codeEditor.current.wrapper;
        if (fullScreen) {
            editor.style.width = `${window.innerWidth}px`;
            editor.style.height = `${window.innerHeight}px`;
            window.addEventListener('keyup', this.handleEsc);
        } else {
            editor.style.width = typeof width === 'string' ? width : `${width}px`;
            editor.style.height = typeof height === 'string' ? height : `${height}px`;
            window.removeEventListener('keyup', this.handleEsc);
        }
        const { clientWidth, clientHeight } = editor;
        if (toolbar) {
            codeWrapper.style.height = `${clientHeight-toolbar.clientHeight}px`;
            preview.style.height = `${clientHeight-toolbar.clientHeight}px`;
            preview.style.top = `${toolbar.clientHeight+1}px`;
        } else {
            codeWrapper.style.height = `${clientHeight}px`;
        }

        codeWrapper.style.marginTop = toolbar ? `${toolbar.clientHeight+1}px` : 0;

        if (watch) {
            preview.style.width = `${(clientWidth+1)/2}px`;
            codeWrapper.style.width = `${clientWidth/2}px`;
            previewContainer.style.padding = '20px';
        } else {
            codeWrapper.style.width = `${clientWidth}px`;
        }
    };

    handleEsc = e => {
        if (!e.shiftKey && e.keyCode === 27) {
            const { fullScreen } = this.state;
            if (fullScreen) {
                this.setState({
                    fullScreen: false,
                }, () => {
                    this.resize();
                })
            }
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
            preview.scrollTop = preview.scrollHeight;
        } else {
            preview.scrollTop = preview.scrollHeight * percent;
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
            codeScroller.scrollTop = codeScroller.scrollHeight;
        } else {
            codeScroller.scrollTop = codeScroller.scrollHeight * percent;
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
                    const selection = editor.getSelection();
                    const dialog = Dialog.showLinkDialog({
                        classPrefix: classPrefix,
                        editor: this.editor.current,
                        contentProps: {
                            selection
                        },
                        buttons: [
                            {
                                text: '确定',
                                type: 'enter',
                                onClick: () => {
                                    const { container } = dialog.props;
                                    const url = container.querySelector('[data-url]').value;
                                    const title = container.querySelector('[data-title]').value;
                                    let str = '';
                                    if (title && title !=='') {
                                        str = `[${title !== '' ? title : url}](${url} "${title}")`;
                                    } else {
                                        str = `[${url}](${url})`
                                    }
                                    editor.replaceSelection(str);
                                    editor.focus();
                                    dialog.destroy();
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    dialog.destroy();
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '引用链接',
                icon: faAnchor,
                onClick: (editor) => {
                    const selection = editor.getSelection();
                    const dialog = Dialog.showReferenceLinkDialog({
                        classPrefix: classPrefix,
                        editor: this.editor.current,
                        contentProps: {
                            selection
                        },
                        buttons: [
                            {
                                text: '确定',
                                type: 'enter',
                                onClick: () => {
                                    const { container } = dialog.props;
                                    const url = container.querySelector('[data-url]').value;
                                    const title = container.querySelector('[data-title]').value;
                                    const name = container.querySelector('[data-name]').value;
                                    const rid = container.querySelector('[data-url-id]').value;
                                    const cursor = editor.getCursor();
                                    const selection = editor.getSelection();
                                    editor.replaceSelection(`[${name}][${rid}]`);
                                    if (selection === '') {
                                        editor.setCursor(cursor.line, cursor.ch+1);
                                    }
                                    editor.setValue(`${editor.getValue()}\n[${rid}]: ${url} ${title === '' ? '' : `"${title}"`}`);
                                    editor.focus();
                                    dialog.destroy();
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    dialog.destroy();
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '添加图片',
                icon: faImage,
                onClick: (editor) => {
                    const { imageUploadProps } = this.props;
                    const selection = editor.getSelection();
                    const dialog = Dialog.showImageDialog({
                        classPrefix: classPrefix,
                        editor: this.editor.current,
                        imageUploadProps,
                        contentProps: {
                            selection
                        },
                        buttons: [
                            {
                                text: '确定',
                                type: 'enter',
                                onClick: () => {
                                    const { container } = dialog.props;
                                    const url = container.querySelector('[data-url]').value;
                                    const alt = container.querySelector('[data-alt]').value;
                                    const link = container.querySelector('[data-link]').value;
                                    const cursor = editor.getCursor();
                                    const altAttr = alt !== '' ? `"${alt}"` : '';
                                    if (link === '' || link === 'http://') {
                                        editor.replaceSelection(`![${alt}](${url}) ${altAttr}`)
                                    } else {
                                        editor.replaceSelection(`[![${alt}](${url} ${altAttr})](${link} ${altAttr})`)
                                    }
                                    if (alt === '') {
                                        editor.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    editor.focus();
                                    dialog.destroy();
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    dialog.destroy();
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '行内代码',
                icon: faCode,
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    const selection = editor.getSelection();
                    editor.replaceSelection(`\`${selection}\``);
                    if (selection === '') {
                        editor.setCursor(cursor.line, cursor.ch+1);
                    }
                }
            },
            {
                title: '表格',
                icon: faTable,
                onClick: (editor) => {
                    const dialog = Dialog.showTableDialog({
                        classPrefix: classPrefix,
                        editor: this.editor.current,
                        buttons: [
                            {
                                text: '确定',
                                type: 'enter',
                                onClick: () => {
                                    const { container } = dialog.props;
                                    const rows = container.querySelector('[data-rows]').value;
                                    const cols = container.querySelector('[data-cols]').value;
                                    const align = container.querySelector('[name="table-align"]:checked').value;
                                    let table = '';
                                    const hrLine = "------------";
                                    const alignSign = {
                                      default: hrLine,
                                      left: `:${hrLine}`,
                                      center: `:${hrLine}:`,
                                      right: `${hrLine}:`
                                    };
                                    if (rows > 1 && cols > 0) {
                                        for (let r = 0, len = rows; r < len; r++) {
                                            const row = [];
                                            const head = [];
                                            for (let c = 0, len2 = cols; c < len2; c++) {
                                                if (r === 1) {
                                                    head.push(alignSign[align])
                                                }
                                                row.push(' ');
                                            }
                                            if (r === 1) {
                                                table += `| ${head.join(' | ')} |\n`;
                                            }
                                            table += `| ${row.join(cols === 1 ? '' : ' | ')} |\n`;
                                        }
                                    }
                                    editor.replaceSelection(table);
                                    editor.focus();
                                    dialog.destroy();
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    dialog.destroy();
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '日期时间',
                icon: faClock,
                onClick: (editor) => {
                    const { dateFormat } = this.props;
                    editor.focus();
                    moment.locale(navigator.userLanguage||navigator.language);
                    editor.replaceSelection(moment().format(dateFormat));
                }
            },
            {
                title: '插入分页符',
                icon: faNewspaper,
                onClick: (editor) => {
                    editor.focus();
                    editor.replaceSelection('\r\n[========]\r\n');
                }
            },
            '|',
            {
                title: '跳转到行',
                icon: faTerminal,
                onClick: (editor) => {
                    const dialog = Dialog.showGotoLineDialog({
                        classPrefix: classPrefix,
                        editor: this.editor.current,
                        contentProps: {
                            lineCount: editor.lineCount()
                        },
                        buttons: [
                            {
                                text: '确定',
                                type: 'enter',
                                onClick: () => {
                                    const { container } = dialog.props;
                                    const line = container.querySelector('[data-line-number]').value;
                                    editor.setCursor({ line: line-1, ch: 0 });
                                    const scrollInfo = editor.getScrollInfo();
                                    const clientHeight = scrollInfo.clientHeight;
                                    const coords = editor.charCoords({ line: line-1, ch: 0 }, 'local');
                                    editor.scrollTo(null, (coords.top + coords.bottom - clientHeight) / 2);
                                    const codeScroller = this.codeEditor.current.scroller;
                                    const {
                                        clientHeight: height,
                                        scrollTop,
                                        scrollHeight
                                    } = codeScroller;
                                    const percent = scrollTop / scrollHeight;
                                    this.previewScroll(scrollTop, scrollHeight, height, percent);
                                    editor.focus();
                                    dialog.destroy();
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    dialog.destroy();
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '全屏（按ESC还原）',
                icon: faArrowsAlt,
                onClick: (editor) => {
                    const { fullScreen } = this.state;
                    this.setState({
                        fullScreen: !fullScreen
                    }, () => {
                        this.resize();
                    });

                }
            },
        ];

        return (
            <ul className={`${classPrefix}-menu`}>
                {menuList.map((item, index) => {
                    if (typeof item === 'string') {
                        return <li className="divider" key={index}/>
                    } else {
                        const { icon, title, text, onClick } = item;
                        return (
                            <li
                                key={index}
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
            codeMirrorProps
        } = this.props;

        const { text, watch, fullScreen } = this.state;
        return (
            <div
                className={classNames(classPrefix, fullScreen ? `${classPrefix}-fullscreen` : '')}
                style={{ width, height }}
                ref={this.editor}
            >
                <CodeEditor
                    ref={this.codeEditor}
                    value={text}
                    codeMirrorProps={codeMirrorProps}
                    onChange={this.handleChange}
                    onScroll={this.previewScroll}
                />
                {watch && (
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
                )}
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
    height: 500,
    watch: true,
    fullScreen: false,
    dateFormat: 'YYYY年MM月DD日 dddd'
};

MarkdownEditor.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    classPrefix: PropTypes.string
};

export default MarkdownEditor;
