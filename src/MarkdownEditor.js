import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import CodeMirror from './CodeMirror';

import './MarkdownEditor.less';

class MarkdownEditor extends PureComponent {

    constructor(props) {
        super(props);
        const {
            width,
            height,
            value,
        } = props;
        this.state = {
            _width: width,
            _height: height,
            text: value || '',
        };
        this.editor = React.createRef();
        this.preview = React.createRef();
        this.previewContainer = React.createRef();
    }



    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const { offsetWidth, offsetHeight } = this.editor.current;
        this.setState({
            _width: offsetWidth/2,
            _height: offsetHeight
        });
        const previewContainer = this.previewContainer.current;
        previewContainer.style.padding = '20px';
    };

    handleChange = value => {
        this.setState({
            text: value
        })
    };

    previewScroll = (top, scrollHeight, height, percent) => {
        const preview = this.preview.current;
        if (top === 0) {
            preview.scrollTop = 0
        } else if (top + height >= scrollHeight - 16) {
            preview.scrollTop = scrollHeight;
        } else {
            preview.scrollTop = scrollHeight * percent;
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
            offsetHeight: height,
            scrollTop,
            scrollHeight
        } = e.currentTarget;
        const percent = scrollTop / scrollHeight;
        const editor = this.editor.current;
        const codeView = editor.querySelector('.CodeMirror-scroll');
        if (scrollTop === 0) {
            codeView.scrollTop = 0
        } else if (scrollTop + height >= scrollHeight) {
            codeView.scrollTop = scrollHeight;
        } else {
            codeView.scrollTop = scrollHeight * percent;
        }
    };

    render() {

        const {
            classPrefix,
            width,
            height,
            ...props
        } = this.props;

        const { _width, _height, text } = this.state;
        return (
            <div
                {...props}
                className="zhique-markdown"
                style={{ width, height }}
                ref={this.editor}
            >
                <CodeMirror
                    value={text}
                    width={_width-2}
                    height={_height-2}
                    onChange={this.handleChange}
                    onScroll={this.previewScroll}
                />
                <div
                    className={classNames(`${classPrefix}preview`)}
                    style={{ width: _width, height: _height }}
                    ref={this.preview}
                    onMouseOver={this.previewBindScroll}
                    onMouseOut={this.previewUnbindScroll}
                >
                    <div
                        className={classNames('markdown-body', `${classPrefix}preview-container`)}
                        ref={this.previewContainer}
                    >
                        {text}
                    </div>
                </div>
            </div>
        )
    }
}

MarkdownEditor.defaultProps = {
    width: '90%',
    height: 100,
    classPrefix: 'zhique-markdown-'
};

MarkdownEditor.propTypes = {
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    classPrefix: PropTypes.string
};

export default MarkdownEditor;
