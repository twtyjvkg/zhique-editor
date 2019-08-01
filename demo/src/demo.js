import React from 'react';
import ReactDom from 'react-dom';

import { MarkdownEditor } from '../../src/';

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
    "- toolbar for markdown\n" +
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
    "  import { MarkdownEditor } from '@zhique-design/zhique-editor';\n" +
    "  ReactDom.render(<MarkdownEditor />, document.getElementById('app'));\n" +
    "  ```\n" +
    "2. **props**\n" +
    "\n" +
    "  |  prop\t | description | type  | default  |\n" +
    "  | :------------: | :------------: | :------------: | :------------: |\n" +
    "  |  `classPrefix` |  component class prefix | string |  `zhique-markdown` |\n" +
    "  |  `width` |  component width |  string or number |  `90%` |\n" +
    "  |  `height` |  component height |  string or number | `500`  |\n" +
    "  |  `watch` |  Real-time Preview |  bool | `true`  |\n" +
    "  |  `fullScreen` |  fullScreen mode |  bool |  `false` |\n" +
    "  | `dateFormat`  | date format  | string  | `YYYY年MM月DD日 dddd`  |\n" +
    "  |  `value` | component value  |  string | `''`  |\n" +
    "  |  `imageUploadProps` |  the props of iamge upload dialog | object  |  - |\n" +
    "  | `codeMirrorProps` | the props of codeMirror | object | - |\n" +
    "  |  `onChange` |  the component value has been changed |  function(value) |  - |\n" +
    "  \n" +
    "3. **imageUploadProps**\n" +
    "\n" +
    " |  prop\t | description | type  | default  |\n" +
    "  | :------------: | :------------: | :------------: | :------------: |\n" +
    "  | `fieldName` | the name of image field | string | `image` |\n" +
    "  | `header` | the request header | object | - |\n" +
    "|  `uploadUrl` |  image upload url |  string |  - |\n" +
    "|  `uploadCallback` |  image upload callback | function(response)  |  - |\n" +
    "\n" +
    "4. **codeMirrorProps**\n" +
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

ReactDom.render(<MarkdownEditor id="test-editor" value={value} imageUploadURL="http://localhost:8000/api/v1/attachment/image" />, document.getElementById('app'));
