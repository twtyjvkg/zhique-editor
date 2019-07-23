zhique-editor
======================

[![Build Status](https://www.travis-ci.org/zhique-design/zhique-editor.svg?branch=master)](https://www.travis-ci.org/zhique-design/zhique-editor)

**zhique-editor** : The open source online code editor (component), based on react & react-markdown & react-codemirror2.

## Features

<ul>
  <li>
    <strong>v0.1.0</strong>
    <ul>
      <li>Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown)</li>
      <li>Real-time Preview, Code fold, Code syntax highlighting...</li>
    </ul>
  </li>
  <li>
    <strong>v0.2.0</strong>
    <ul>
      <li>Synchronized scrolling</li>
      <li>ui refactoring</li>
      <li>
        <strong>v0.2.1</strong>
        <ul>
          <li>fixed some bug</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

--------

**zhique-editor** : 是一款开源的在线代码编辑器（组件），基于 react、react-markdown 和 react-codemirror2 构建。

## 主要特性

<ul>
  <li>
    <strong>v0.1.0</strong>
    <ul>
      <li>支持通用 Markdown / CommonMark 和 GFM (GitHub Flavored Markdown) 风格的语法</li>
      <li>实时预览、代码折叠、语法高亮...</li>
    </ul>
  </li>
  <li>
    <strong>v0.2.0</strong>
    <ul>
      <li>同步滚动</li>
      <li>UI重构</li>
      <li>
        <strong>v0.2.1</strong>
        <ul>
          <li>修复一些bug</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

## Installing

- npm

```
npm install @zhique-design/zhique-editor
```

- yarn

```
yarn add @zhique-design/zhique-editor
```

## Basic usage

```typescript jsx
import MarkdownEditor from '@zhique-design/zhique-editor';

<MarkdownEditor />
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
