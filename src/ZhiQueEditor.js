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
    faQuoteLeft
} from '@fortawesome/free-solid-svg-icons';
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

const ToolItem = ({ icon, text, onClick }) => (
    <li
        onClick={onClick}
    >
        <i title={text}><FontAwesomeIcon icon={icon} /></i>
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
                                text="撤销（Ctrl+Z）"
                                icon={faUndo}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    cm.undo();
                                }}
                            />
                            <ToolItem
                                text="重做（Ctrl+Y）"
                                icon={faRedo}
                                onClick={e => {
                                    e.preventDefault();
                                    const cm = this.editor;
                                    cm.redo();
                                }}
                            />
                            <li className="divider">|</li>
                            <ToolItem
                                text="粗体"
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
                                text="删除线"
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
                                text="斜体"
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
                                text="引用"
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