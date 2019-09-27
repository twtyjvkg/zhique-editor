import React from 'react';
import ReactDom from 'react-dom';

import ZhiQueEditor from '../../src/';

const value = "zhique-editor\n" +
    "======================\n" +
    "\n" +
    "[![Build Status](https://www.travis-ci.org/zhique-design/zhique-editor.svg?branch=master)](https://www.travis-ci.org/zhique-design/zhique-editor)\n" +
    "\n" +
    "**zhique-editor** : The open source online code editor (component), based on [react](https://reactjs.org/ \"react\") & [react-markdown](http://rexxars.github.io/react-markdown/ \"react-markdown\") & [codemirror](https://codemirror.net/ \"codemirror\").\n" +
    "\n" +
    "## Features\n" +
    "\n" +
    "- Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown)\n" +
    "- Real-time Preview, Code fold, Code syntax highlighting...\n" +
    "- Synchronized scrolling\n" +
    "- powerful toolbar for markdown editor\n" +
    "- image viewer\n" +
    "\n" +
    "## Installing\n" +
    "\n" +
    "- npm\n" +
    "\n" +
    "```\n" +
    "npm install @zhique-design/zhique-editor\n" +
    "```\n" +
    "\n" +
    "- yarn\n" +
    "\n" +
    "```\n" +
    "yarn add @zhique-design/zhique-editor\n" +
    "```\n" +
    "\n" +
    "------------\n" +
    "\n" +
    "MarkdownEditor\n" +
    "--------------\n" +
    "1. **Basic usage**\n" +
    "\n" +
    "  ```typescript jsx\n" +
    "  import React from 'react';\n" +
    "  import ReactDom from 'react-dom';\n" +
    "  import ZhiQueEditor from '@zhique-design/zhique-editor';\n" +
    "  ReactDom.render(<ZhiQueEditor />, document.getElementById('app'));\n" +
    "  ```\n" +
    "2. **props**\n" +
    "\n" +
    "  |  prop\t | description | type  | default  |\n" +
    "  | :------------: | :------------: | :------------: | :------------: |\n" +
    "  |  `classPrefix` |  component class prefix | string |  `zhique-markdown` |\n" +
    "  |  `type` |  component type(markdown-editor or markdown) | string |  `markdown-editor` |\n" +
    "  |  `width` |  component width |  string or number |  `90%` |\n" +
    "  |  `height` |  component height |  string or number | `500`  |\n" +
    "  |  `watch` |  Real-time Preview |  bool | `true`  |\n" +
    "  |  `fullScreen` |  fullScreen mode |  bool |  `false` |\n" +
    "  | `dateFormat`  | date format  | string  | `YYYY年MM月DD日 dddd`  |\n" +
    "  |  `value` | component value  |  string | `''`  |\n" +
    "  | `options` | the options of codeMirror | object | - |\n" +
    "   |  `onImageSelect` |  the image has been selected to upload |  function(e, field) |  - |\n" +
    "  |  `onChange` |  the component value has been changed |  function(value) |  - |\n" +
    "\n" +
    "4. **options**\n" +
    "\n" +
    "  ```clike\n" +
    "  {\n" +
    "    mode: 'gfm',\n" +
    "    theme: 'default',\n" +
    "    lineWrapping: true,\n" +
    "    lineNumbers: true,\n" +
    "    foldGutter: true,\n" +
    "    gutters: [\"CodeMirror-linenumbers\", \"CodeMirror-foldgutter\"],\n" +
    "    matchBrackets: true,\n" +
    "    autofocus: true,\n" +
    "    autoCloseBrackets: true,\n" +
    "    matchTags: true,\n" +
    "    autoCloseTags: true,\n" +
    "    styleActiveLine: true,\n" +
    "    styleSelectedText: true\n" +
    "  }\n" +
    "  ```\n" +
    "  click [codemirror configuration](https://codemirror.net/doc/manual.html#config \"codemirror configuration\") for more info.\n";

ReactDom.render(<ZhiQueEditor type="markdown-editor" id="test-editor" value={value}/>, document.getElementById('app'));
