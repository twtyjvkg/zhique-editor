import React from 'react';
import ReactDom from 'react-dom';

import { MarkdownEditor } from '../../src/';

const value = "zhique-editor\n" +
    "======================\n" +
    "\n" +
    "[![Build Status](https://www.travis-ci.org/zhique-design/zhique-editor.svg?branch=master)](https://www.travis-ci.org/zhique-design/zhique-editor)\n" +
    "\n" +
    "**zhique-editor** : The open source online code editor (component), based on react & react-markdown & react-codemirror2.\n" +
    "\n" +
    "## Features\n" +
    "\n" +
    "<ul>\n" +
    "  <li>\n" +
    "    <strong>v0.1.0</strong>\n" +
    "    <ul>\n" +
    "      <li>Support Standard Markdown / CommonMark and GFM (GitHub Flavored Markdown)</li>\n" +
    "      <li>Real-time Preview, Code fold, Code syntax highlighting...</li>\n" +
    "    </ul>\n" +
    "  </li>\n" +
    "  <li>\n" +
    "    <strong>v0.2.0</strong>\n" +
    "    <ul>\n" +
    "      <li>Synchronized scrolling</li>\n" +
    "      <li>ui refactoring</li>\n" +
    "      <li>\n" +
    "        <strong>v0.2.1</strong>\n" +
    "        <ul>\n" +
    "          <li>fixed some bug</li>\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "\n" +
    "--------\n" +
    "\n" +
    "**zhique-editor** : 是一款开源的在线代码编辑器（组件），基于 react、react-markdown 和 react-codemirror2 构建。\n" +
    "\n" +
    "## 主要特性\n" +
    "\n" +
    "<ul>\n" +
    "  <li>\n" +
    "    <strong>v0.1.0</strong>\n" +
    "    <ul>\n" +
    "      <li>支持通用 Markdown / CommonMark 和 GFM (GitHub Flavored Markdown) 风格的语法</li>\n" +
    "      <li>实时预览、代码折叠、语法高亮...</li>\n" +
    "    </ul>\n" +
    "  </li>\n" +
    "  <li>\n" +
    "    <strong>v0.2.0</strong>\n" +
    "    <ul>\n" +
    "      <li>同步滚动</li>\n" +
    "      <li>UI重构</li>\n" +
    "      <li>\n" +
    "        <strong>v0.2.1</strong>\n" +
    "        <ul>\n" +
    "          <li>修复一些bug</li>\n" +
    "        </ul>\n" +
    "      </li>\n" +
    "      <li>\n" +
    "              <strong>v0.2.2</strong>\n" +
    "              <ul>\n" +
    "                <li>修改模块调用方式</li>\n" +
    "              </ul>\n" +
    "            </li>\n" +
    "    </ul>\n" +
    "  </li>\n" +
    "</ul>\n" +
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
    "## Basic usage\n" +
    "\n" +
    "```typescript jsx\n" +
    "import { MarkdownEditor } from '@zhique-design/zhique-editor';\n" +
    "\n" +
    "<MarkdownEditor />\n" +
    "```\n" +
    "\n" +
    "## props\n" +
    "\n" +
    "| prop     | type&nbsp;*`default`*              | description      |\n" +
    "|----------|------------------------------------|------------------|\n" +
    "| `value`  | string&nbsp;*`''`*                 | component value  |\n" +
    "| `height` | number or string &nbsp;*`500`*     | component height |\n" +
    "\n" +
    "## events\n" +
    "\n" +
    "| event      | description                           |\n" +
    "|------------|---------------------------------------|\n" +
    "| `onChange` | the component value has been changed  |\n";

ReactDom.render(<MarkdownEditor id="test-editor" value={value} />, document.getElementById('app'));
