import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarkDown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    faDesktop,
    faArrowsAlt,
    faEraser,
    faSearch,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
    faImage,
    faFileCode,
    faClock,
    faSmile,
    faCopyright,
    faNewspaper,
    faEyeSlash,
    faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import { Controlled as CodeMirror } from 'react-codemirror2';

import CodeBlock from './CodeBlock';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars';

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

import './ZhiQueEditor.less';

const ToolItem = ({ icon, title, text, onClick }) => (
    <li
        onClick={onClick}
    >
        <i title={title}>{icon && <FontAwesomeIcon icon={icon} />}{text}</i>
    </li>
);


class ZhiQueEditor extends Component {

    constructor(props) {
        super(props);
        const { value } = props;
        this.state = {
            text: value || '',
        };
        this.previewArea = React.createRef();
        this.editor = null;
    }

    handleBeforeChange = (editor, data, value) => {
        this.setState({
            text: value,
        });
    };

    handleChange = (editor, data, value) => {
        const { onChange} = this.props;
        const { height, top } = data;
        const previewArea = this.previewArea.current;
        const { scrollHeight } = previewArea;
        previewArea.scrollTo(0, scrollHeight * top / height + Math.max(0, scrollHeight - height) * top / height);
        if (onChange) onChange(value);
    };

    handleScroll = (editor, data) => {
        const { height, top } = data;
        const previewArea = this.previewArea.current;
        const { scrollHeight } = previewArea;
        previewArea.scrollTo(0, scrollHeight * top / height + Math.max(0, scrollHeight - height) * top / height);
    };

    handleWheel = e => {
        e.stopPropagation();
        const { deltaY } = e;
        const { doc: { scrollTop } } = this.editor;
        const previewArea = this.previewArea.current;
        this.editor.scrollTo(0, Math.max(0, scrollTop + deltaY));
        previewArea.scrollTo(0, Math.max(0, previewArea.scrollTop + deltaY));
    };

    render() {

        const { height } = this.props;
        const { text } = this.state;
        return (
            <div className="zhique-markdown-editor-wrapper">
                <div className="zhique-markdown-editor-toolbar">
                    <div className="editor-toolbar-container">
                        <ul className="editor-tool-menu">
                            <ToolItem
                                title="撤销（Ctrl+Z）"
                                icon={faUndo}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    cm.undo();
                                }}
                            />
                            <ToolItem
                                title="重做（Ctrl+Y）"
                                icon={faRedo}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    cm.redo();
                                }}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                title="粗体"
                                icon={faBold}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    cm.replaceSelection(`**${selection}**`);
                                    if ('' === selection) {
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                }}
                            />
                            <ToolItem
                                title="删除线"
                                icon={faStrikethrough}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    cm.replaceSelection(`~~${selection}~~`);
                                    if ('' === selection) {
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                }}
                            />
                            <ToolItem
                                title="斜体"
                                icon={faItalic}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    cm.replaceSelection(`*${selection}*`);
                                    if ('' === selection) {
                                        cm.setCursor(cursor.line, cursor.ch + 1);
                                    }
                                }}
                            />
                            <ToolItem
                                title="引用"
                                icon={faQuoteLeft}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0) {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection("> " + selection);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    } else {
                                        cm.replaceSelection("> " + selection);
                                    }
                                }}
                            />
                            <ToolItem
                                title="将每个单词首字母转成大写"
                                text="Aa"
                            />
                            <ToolItem
                                title="将所选转换成大写"
                                text="A"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const selection = cm.getSelection();
                                    const selections = cm.listSelections();
                                    cm.replaceSelection(selection.toUpperCase());
                                    cm.setSelections(selections)
                                }}
                            />
                            <ToolItem
                                title="将所选转换成小写"
                                text="a"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const selection = cm.getSelection();
                                    const selections = cm.listSelections();
                                    cm.replaceSelection(selection.toLowerCase());
                                    cm.setSelections(selections)
                                }}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                title="标题1"
                                text="H1"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0)
                                    {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection(`# ${selection}`);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    else
                                    {
                                        cm.replaceSelection(`# ${selection}`);
                                    }
                                }}
                            />
                            <ToolItem
                                title="标题2"
                                text="H2"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0)
                                    {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection(`## ${selection}`);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    else
                                    {
                                        cm.replaceSelection(`## ${selection}`);
                                    }
                                }}
                            />
                            <ToolItem
                                title="标题3"
                                text="H3"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0)
                                    {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection(`### ${selection}`);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    else
                                    {
                                        cm.replaceSelection(`### ${selection}`);
                                    }
                                }}
                            />
                            <ToolItem
                                title="标题4"
                                text="H4"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0)
                                    {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection(`#### ${selection}`);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    else
                                    {
                                        cm.replaceSelection(`#### ${selection}`);
                                    }
                                }}
                            />
                            <ToolItem
                                title="标题5"
                                text="H5"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0)
                                    {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection(`##### ${selection}`);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    else
                                    {
                                        cm.replaceSelection(`##### ${selection}`);
                                    }
                                }}
                            />
                            <ToolItem
                                title="标题6"
                                text="H6"
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    const selection = cm.getSelection();
                                    if (cursor.ch !== 0)
                                    {
                                        cm.setCursor(cursor.line, 0);
                                        cm.replaceSelection(`###### ${selection}`);
                                        cm.setCursor(cursor.line, cursor.ch + 2);
                                    }
                                    else
                                    {
                                        cm.replaceSelection(`###### ${selection}`);
                                    }
                                }}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                title="无序列表"
                                icon={faListUl}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const selection = cm.getSelection();
                                    if ('' === selection) {
                                        cm.replaceSelection(`- ${selection}`);
                                    } else {
                                        const selectionText = selection.split('\n').map(item => (
                                            '' === item ? '' : `- ${item}`
                                        ));
                                        cm.replaceSelection(selectionText.join('\n'));
                                    }
                                }}
                            />
                            <ToolItem
                                title="有序列表"
                                icon={faListOl}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const selection = cm.getSelection();
                                    if ('' === selection) {
                                        cm.replaceSelection(`1. ${selection}`);
                                    } else {
                                        const selectionText = selection.split('\n').map((item, index) => (
                                            '' === item ? '' : `${index + 1}. ${item}`
                                        ));
                                        cm.replaceSelection(selectionText.join('\n'));
                                    }
                                }}
                            />
                            <ToolItem
                                title="横线"
                                icon={faMinus}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    const cursor = cm.getCursor();
                                    cm.replaceSelection(`${(0 !== cursor.ch) ? '\n\n' : '\n'}------------\n\n`)
                                }}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                title="链接"
                                icon={faLink}
                            />
                            <ToolItem
                                title="引用链接"
                                icon={faAnchor}
                            />
                            <ToolItem
                                title="添加图片"
                                icon={faImage}
                            />
                            <ToolItem
                                title="行内代码"
                                icon={faCode}
                            />
                            <ToolItem
                                title="预格式文本 / 代码块（缩进风格）"
                                icon={faFileCode}
                            />
                            <ToolItem
                                title="代码块（多语言风格）"
                                icon={faFileCode}
                            />
                            <ToolItem
                                title="添加表格"
                                icon={faTable}
                            />
                            <ToolItem
                                title="日期时间"
                                icon={faClock}
                            />
                            <ToolItem
                                title="Emoji表情"
                                icon={faSmile}
                            />
                            <ToolItem
                                title="HTML实体字符"
                                icon={faCopyright}
                            />
                            <ToolItem
                                title="插入分页符"
                                icon={faNewspaper}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                title="跳转到行"
                                icon={faTerminal}
                            />
                            <ToolItem
                                title="关闭实时预览"
                                icon={faEyeSlash}
                            />
                            <ToolItem
                                title="全窗口预览HTML（按 Shift + ESC还原）"
                                icon={faDesktop}
                            />
                            <ToolItem
                                title="全屏（按ESC还原）"
                                icon={faArrowsAlt}
                            />
                            <ToolItem
                                title="清空"
                                icon={faEraser}
                            />
                            <ToolItem
                                title="搜索"
                                icon={faSearch}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                title="使用帮助"
                                icon={faQuestionCircle}
                            />
                            <ToolItem
                                title="关于zhique-design-editor"
                                icon={faInfoCircle}
                            />
                        </ul>
                    </div>
                </div>
                <div className="zhique-markdown-editor-area" style={{ height: typeof height === 'number' ? `${height}px` : height}} onWheel={this.handleWheel}>
                    <div className="zhique-markdown-editor">
                        <CodeMirror
                            options={{
                                mode: 'gfm',
                                theme: 'material',
                                lineNumbers: true,
                                autofocus: true,
                                scrollbarStyle: "overlay",
                                foldGutter: true,
                                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                                matchBrackets: true,
                                autoCloseBrackets: true,
                                matchTags: true,
                                autoCloseTags: true,
                            }}
                            value={text}
                            onBeforeChange={this.handleBeforeChange}
                            onChange={this.handleChange}
                            onScroll={this.handleScroll}
                            editorDidMount={(editor) => {
                                editor.setSize('100%', '100%');
                                editor.setOption('lineWrapping', 'auto');
                                this.editor = editor;
                            }}
                        />
                    </div>
                    <div ref={this.previewArea} className="zhique-markdown-preview" style={{ height: typeof height === 'number' ? `${height}px` : height}}>
                        <MarkDown
                            source={text}
                            renderers={{
                                code: CodeBlock
                            }}
                            escapeHtml={false}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

ZhiQueEditor.defaultProps = {
    height: 500,
    onChange: undefined,
};

ZhiQueEditor.propTypes = {
    onChange: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    value: PropTypes.string
};

export default ZhiQueEditor;