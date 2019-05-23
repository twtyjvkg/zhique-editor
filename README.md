zhique-design-editor
======================

[![Build Status](https://www.travis-ci.org/zhique-design/zhique-design-editor.svg?branch=master)](https://www.travis-ci.org/zhique-design/zhique-design-editor)

**zhique-design-editor** : The open source online markdown editor (component), based on react & react-markdown & react-codemirror2.

## Features

- Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown);
- Full-featured: Real-time Preview, Code fold, Code syntax highlighting...;

--------

**zhique-design-editor** : 是一款开源的Markdown 在线编辑器（组件），基于 react、react-markdown 和 react-codemirror2 构建。

## 主要特性

- 支持通用 Markdown / CommonMark 和 GFM (GitHub Flavored Markdown) 风格的语法，也可[变身为代码编辑器];
- 支持实时预览、代码折叠和多语言语法高亮等功能；

## Installing

- npm

```
npm install @zhique-design/zhique-design-editor
```

- yarn

```
yarn add @zhique-design/zhique-design-editor
```

## Basic usage

```typescript jsx
import ZhiQueEditor from 'zhique-design-editor';

<ZhiQueEditor />
```

## props

| prop     | type&nbsp;*`default`*              | description      |
|----------|------------------------------------|------------------|
| `value`  | string&nbsp;*`''`*                 | component value  |
| `height` | number or string &nbsp;*`500`*     | component height |

## events

| event      | description                           |
|------------|---------------------------------------|
| `onChange` | the component value has been changed  |
