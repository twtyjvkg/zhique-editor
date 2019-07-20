import React from 'react';
import ReactDom from 'react-dom';

import MarkdownEditor from '../../src/MarkdownEditor';

ReactDom.render(<MarkdownEditor id="test-editor" />, document.getElementById('app'));