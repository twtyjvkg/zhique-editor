zhique-editor
======================

[![Build Status](https://www.travis-ci.org/zhique-design/zhique-editor.svg?branch=master)](https://www.travis-ci.org/zhique-design/zhique-editor)

**zhique-editor** : The open source online code editor (component), based on [react](https://reactjs.org/ "react") & [react-markdown](http://rexxars.github.io/react-markdown/ "react-markdown") & [codemirror](https://codemirror.net/ "codemirror").

## Features

- Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown)
- Real-time Preview, Code fold, Code syntax highlighting...
- Synchronized scrolling
- toolbar for markdown

## Installing

- npm

```
npm install @zhique-design/zhique-editor
```

- yarn

```
yarn add @zhique-design/zhique-editor
```

------------

MarkdownEditor
--------------
1. **Basic usage**

  ```typescript jsx
  import React from 'react';
  import ReactDom from 'react-dom';
  import { MarkdownEditor } from '@zhique-design/zhique-editor';
  ReactDom.render(<MarkdownEditor />, document.getElementById('app'));
  ```
2. **props**

  |  prop	 | description | type  | default  |
  | :------------: | :------------: | :------------: | :------------: |
  |  `classPrefix` |  component class prefix | string |  `zhique-markdown` |
  |  `width` |  component width |  string or number |  `90%` |
  |  `height` |  component height |  string or number | `500`  |
  |  `watch` |  Real-time Preview |  bool | `true`  |
  |  `fullScreen` |  fullScreen mode |  bool |  `false` |
  | `dateFormat`  | date format  | string  | `YYYY年MM月DD日 dddd`  |
  |  `value` | component value  |  string | `''`  |
  |  `imageUploadProps` |  the props of iamge upload dialog | object  |  - |
  | `codeMirrorProps` | the props of codeMirror | object | - |
  |  `onChange` |  the component value has been changed |  function(value) |  - |
  
3. **imageUploadProps**

 |  prop	 | description | type  | default  |
  | :------------: | :------------: | :------------: | :------------: |
  | `fieldName` | the name of image field | string | `image` |
  | `header` | the request header | object | - |
|  `uploadUrl` |  image upload url |  string |  - |
|  `uploadCallback` |  image upload callback | function(response)  |  - |

4. **codeMirrorProps**

  ```clike
  {
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
  }
  ```
  click [codemirror configuration](https://codemirror.net/doc/manual.html#config "codemirror configuration") for more info.
