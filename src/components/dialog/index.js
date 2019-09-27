import React, {Component, Fragment} from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';

import ImageDialog from "./ImageDialog";
import LinkDialog from "./LinkDialog";
import ReferenceLinkDialog from "./ReferenceLinkDialog";
import TableDialog from "./TableDialog";
import GotoLineDialog from "./GotoLineDialog";

import './index.less';

function createDialog(WrappedComponent) {
    return class extends Component {

        componentDidMount =() => {
            const {
                container,
                width,
                editor
            } = this.props;
            container.style.display = 'block';
            container.style.width = typeof width === 'number' ? `${width}px` : width;
            container.style.top = `${(editor.clientHeight-container.clientHeight)/2}px`;
            container.style.left = `${(editor.clientWidth-container.clientWidth)/2}px`;
        };

        destroy = () => {
            const {
                editor,
                container
            } = this.props;
            editor.removeChild(container);
        };

        render = () => {

            const {
                classPrefix,
                title,
                footer,
                ...dialogProps
            } = this.props;

            return (
                <Fragment>
                    {title && (
                        <div className={`${classPrefix}-dialog-header`}>
                            <strong className={`${classPrefix}-dialog-title`}>{title}</strong>
                        </div>
                    )}
                    <div className={`fa ${classPrefix}-dialog-container`}>
                        <WrappedComponent
                            classPrefix={classPrefix}
                            {...dialogProps}
                        />
                    </div>
                    {footer && (
                        <div className={`${classPrefix}-dialog-footer`}>
                            {footer.map(({ text, type='default', onClick }) => (
                                <button
                                    key={text}
                                    className={classNames(`${classPrefix}-btn`, `${classPrefix}-${type}-btn`)}
                                    onClick={onClick}
                                >
                                    {text}
                                </button>
                            ))}
                        </div>
                    )}
                </Fragment>
            )
        }
    }
}

function showDialog(WrappedComponent, props) {
    const { classPrefix, editor } = props;
    let container = document.createElement('div');
    container.setAttribute('class', `${classPrefix}-dialog`);
    editor.appendChild(container);
    return ReactDom.render(React.createElement(createDialog(WrappedComponent), { container, ...props }), container);
}

export function showImageDialog(props) {
    return showDialog(ImageDialog, { title: '添加图片', width: 465, ...props })
}

export  function showLinkDialog(props) {
    return showDialog(LinkDialog, { title: '添加链接', width: 380, ...props })
}

export  function showReferenceLinkDialog(props) {
    return showDialog(ReferenceLinkDialog, { title: '添加引用链接', width: 380, ...props })
}

export  function showTableDialog(props) {
    return showDialog(TableDialog, { title: '添加表格', width: 360, ...props })
}

export  function showGotoLineDialog(props) {
    return showDialog(GotoLineDialog, { title: '跳转到行', width: 400, ...props })
}