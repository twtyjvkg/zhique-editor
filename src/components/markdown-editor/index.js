import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import CodeEditor from '../code-editor';
import Markdown from '../markdown';
import Icon from '../icon';
import Dialog from '../dialog';

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
            fullScreen,
            masking: false
        };
        this.markdownEditor = React.createRef();
        this.codeEditor = React.createRef();
        this.preview = React.createRef();
        this.previewContainer = React.createRef();
        this.toolbar = React.createRef();
    }

    componentDidMount() {
        this.resize();
    }

    resize = () => {
        const { width, height } = this.props;
        const { fullScreen, watch } = this.state;
        const markdownEditor = this.markdownEditor.current;
        const preview = this.preview.current;
        const previewContainer = this.previewContainer.current;
        const codeWrapper = this.codeEditor.current.wrapper;
        const toolbar = this.toolbar.current;
        if (fullScreen) {
            markdownEditor.style.width = `${window.innerWidth}px`;
            markdownEditor.style.height = `${window.innerHeight}px`;
            window.addEventListener('keyup', this.handleEsc);
        } else {
            markdownEditor.style.width = typeof width === 'string' ? width : `${width}px`;
            markdownEditor.style.height = typeof height === 'string' ? height : `${height}px`;
            window.removeEventListener('keyup', this.handleEsc);
        }
        const { clientWidth, clientHeight } = markdownEditor;
        if (toolbar) {
            codeWrapper.style.height = `${clientHeight-toolbar.clientHeight}px`;
            codeWrapper.style.marginTop = toolbar ? `${toolbar.clientHeight+1}px` : 0;
            if (watch) {
                preview.style.height = `${clientHeight-toolbar.clientHeight}px`;
                preview.style.top = `${toolbar.clientHeight+1}px`;
            }
        } else {
            codeWrapper.style.height = `${clientHeight}px`;
            if (watch) preview.style.height = `${clientHeight}px`;
        }
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
        const { watch } = this.state;
        if (watch) {
            const preview = this.preview.current;
            if (top === 0) {
                preview.scrollTop = 0
            } else if (top + height >= scrollHeight - 16) {
                preview.scrollTop = preview.scrollHeight;
            } else {
                preview.scrollTop = preview.scrollHeight * percent;
            }
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

    destroyDialog = (editor, dialog) => {
        editor.focus();
        dialog.destroy();
        this.setState({
            masking: false,
        });
    };

    initToolbarMenu = () => {
        const { classPrefix } = this.props;
        const { fullScreen, watch } = this.state;
        const menuList = [
            {
                title: '撤销（Ctrl+Z）',
                icon: 'undo',
                onClick: (editor) => {
                    editor.focus();
                    editor.undo();
                }
            },
            {
                title: '重做（Ctrl+Y）',
                icon: 'redo',
                onClick: (editor) => {
                    editor.focus();
                    editor.redo();
                }
            },
            '|',
            {
                title: '粗体',
                icon: 'bold',
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
                icon: 'strikethrough',
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
                icon: 'italic',
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
                icon: 'quote-left',
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
                icon: 'unorderedlist',
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
                icon: 'orderedlist',
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
                icon: 'minus',
                onClick: (editor) => {
                    editor.focus();
                    const cursor = editor.getCursor();
                    editor.replaceSelection(`${cursor.ch !== 0 ? '\n\n' : '\n'}------------\n\n`)
                }
            },
            '|',
            {
                title: '链接',
                icon: 'link',
                onClick: (editor) => {
                    this.setState({
                        masking: true,
                    });
                    const selection = editor.getSelection();
                    const dialog = Dialog.showLinkDialog({
                        classPrefix: classPrefix,
                        editor: this.markdownEditor.current,
                        content: {
                            selection
                        },
                        footer: [
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
                                    this.destroyDialog(editor, dialog);
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    this.destroyDialog(editor, dialog);
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '引用链接',
                icon: 'anchor',
                onClick: (editor) => {
                    const selection = editor.getSelection();
                    this.setState({
                        masking: true
                    });
                    const dialog = Dialog.showReferenceLinkDialog({
                        classPrefix: classPrefix,
                        editor: this.markdownEditor.current,
                        content: {
                            selection
                        },
                        footer: [
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
                                    this.destroyDialog(editor, dialog);
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    this.destroyDialog(editor, dialog);
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '添加图片',
                icon: 'image',
                onClick: (editor) => {
                    const { onImageSelect } = this.props;
                    const selection = editor.getSelection();
                    this.setState({
                        masking: true,
                    });
                    const dialog = Dialog.showImageDialog({
                        classPrefix: classPrefix,
                        editor: this.markdownEditor.current,
                        onImageSelect,
                        content: {
                            selection,
                        },
                        footer: [
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
                                    this.destroyDialog(editor, dialog);
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    this.destroyDialog(editor, dialog);
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '行内代码',
                icon: 'code',
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
                icon: 'table',
                onClick: (editor) => {
                    this.setState({
                        masking: true
                    });
                    const dialog = Dialog.showTableDialog({
                        classPrefix: classPrefix,
                        editor: this.markdownEditor.current,
                        footer: [
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
                                    this.destroyDialog(editor, dialog);
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    this.destroyDialog(editor, dialog);
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: '日期时间',
                icon: 'time-circle',
                onClick: (editor) => {
                    const { dateFormat } = this.props;
                    editor.focus();
                    moment.locale(navigator.userLanguage||navigator.language);
                    editor.replaceSelection(moment().format(dateFormat));
                }
            },
            '|',
            {
                title: '跳转到行',
                icon: 'terminal',
                onClick: (editor) => {
                    this.setState({
                        masking: true
                    });
                    const dialog = Dialog.showGotoLineDialog({
                        classPrefix: classPrefix,
                        editor: this.markdownEditor.current,
                        content: {
                            lineCount: editor.lineCount()
                        },
                        footer: [
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
                                    this.destroyDialog(editor, dialog);
                                }
                            },
                            {
                                text: '取消',
                                type: 'cancel',
                                onClick: () => {
                                    this.destroyDialog(editor, dialog);
                                }
                            }
                        ]
                    });
                }
            },
            {
                title: fullScreen ? '退出全屏' : '全屏（按ESC还原）',
                icon: `fullscreen${fullScreen ? '-exit' : ''}`,
                onClick: () => {
                    const { fullScreen } = this.state;
                    this.setState({
                        fullScreen: !fullScreen
                    }, () => {
                        this.resize();
                    });
                }
            },
            {
                title: `${watch ? '关闭' : '开启'}实时预览`,
                icon: `eye${watch ? '-close' : ''}`,
                onClick: () => {
                    this.setState({
                        watch: !watch,
                    }, () => {
                        this.resize();
                    })
                }
            }
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
                                title={title}
                            >
                                <a className="icon">
                                    <i>
                                        {icon && (
                                            <Icon type={icon} />
                                        )}
                                        {text}
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

        const { text, watch, fullScreen, masking } = this.state;

        return (
            <div
                className={classNames(`${classPrefix}-editor`, fullScreen ? `${classPrefix}-fullscreen` : '')}
                style={{ width, height }}
                ref={this.markdownEditor}
            >
                <Icon type="menu" />
                <CodeEditor
                    value={text}
                    ref={this.codeEditor}
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
                            className={`${classPrefix}-preview-container`}
                            ref={this.previewContainer}
                        >
                            <Markdown value={text} />
                        </div>
                    </div>
                )}
                <div className={classNames(`${classPrefix}-mask`, masking ? 'show-mask' : '')} />
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

export default MarkdownEditor;