import React, { Component, Fragment } from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import LinkDialog from "./LinkDialog";
import ReferenceLinkDialog from "./ReferenceLinkDialog";
import ImageDialog from "./ImageDialog";
import TableDialog from "./TableDialog";
import GotoLineDialog from "./GotoLineDialog";

import './index.less';

class Dialog extends Component {

    componentDidMount() {
        this.init();
        this.position();
    }

    init = () => {
        const {
            container,
            width,
            zIndex
        } = this.props;
        container.style.zIndex = zIndex;
        container.style.display = 'block';
        container.style.width = typeof width === 'number' ? `${width}px` : width;
    };

    position = () => {
        const {
            container,
        } = this.props;
        container.style.top = `${(container.parentElement.clientHeight-container.clientHeight)/2}px`;
        container.style.left = `${(container.parentElement.clientWidth-container.clientWidth)/2}px`;
    };

    destroy = () => {
        const {
            editor,
            container
        } = this.props;
        editor.removeChild(container);
    };

    render() {

        const {
            classPrefix,
            title,
            closed,
            content,
            footer,
            buttons,
        } = this.props;

        return (
            <Fragment>
                {title && (
                    <div className={`${classPrefix}-dialog-header`}>
                        <strong className={`${classPrefix}-dialog-title`}>{title}</strong>
                    </div>
                )}
                {closed && (
                    <a
                        className={`${classPrefix}-dialog-close`}
                        onClick={() => {
                            this.destroy();
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </a>
                )}
                <div className={`fa ${classPrefix}-dialog-container`}>
                    {content}
                    {(buttons || footer && typeof footer === 'string')  && (
                        <div className={`${classPrefix}-dialog-footer`}>
                            {buttons.map(({text, type='default', onClick}) => (
                                <button
                                    key={text}
                                    className={classNames(`${classPrefix}-btn`, `${classPrefix}-${type}-btn`)}
                                    onClick={onClick}
                                >
                                    {text}
                                </button>
                            ))}
                            {footer}
                        </div>
                    )}
                </div>
            </Fragment>
        )
    }
}

Dialog.defaultProps = {
    width: 420,
    height: 240,
    closed: true,
    mask: true,
    lockScreen: true,
    footer: true,
    buttons: false,
    zIndex: 99999,
};

Dialog.showDialog = props => {
    const { classPrefix, editor, contentProps, ...dialogProps } = props;
    let div = document.createElement('div');
    div.setAttribute('class', `${classPrefix}-dialog`);
    editor.appendChild(div);
    return ReactDom.render(React.createElement(Dialog, {
        ...dialogProps,
        classPrefix: classPrefix,
        editor,
        container: div,
    }), div);
};

Dialog.showLinkDialog = props => {
    const {
        classPrefix,
        contentProps,
        title='添加链接',
        width=380,
        height=211
    } = props;
    return  Dialog.showDialog({
        ...props,
        content: <LinkDialog classPrefix={classPrefix} {...contentProps} />,
        title,
        width,
        height,
    });
};

Dialog.showReferenceLinkDialog = props => {

    const {
        classPrefix,
        contentProps,
        title='添加引用链接',
        width=380,
        height=296
    } = props;
    return  Dialog.showDialog({
        ...props,
        content: <ReferenceLinkDialog classPrefix={classPrefix} {...contentProps} />,
        title,
        width,
        height,
    });
};

Dialog.showImageDialog = props => {

    const {
        classPrefix,
        contentProps,
        title='添加图片',
        imageUpload=true,
        width=(imageUpload ? 465 : 380),
        imageUploadProps,
    } = props;
    return  Dialog.showDialog({
        ...props,
        content: <ImageDialog imageUploadProps={imageUploadProps} classPrefix={classPrefix} imageUpload={imageUpload} {...contentProps} />,
        title,
        width,
    });
};

Dialog.showTableDialog = props => {
    const {
        classPrefix,
        contentProps,
        title='添加表格',
        width=360,
    } = props;
    return Dialog.showDialog({
        ...props,
        content: <TableDialog classPrefix={classPrefix} {...contentProps} />,
        title,
        width,
    })
};

Dialog.showGotoLineDialog = props => {
    const {
        classPrefix,
        contentProps,
        title='跳转到行',
        width=400,
    } = props;
    return Dialog.showDialog({
        ...props,
        content: <GotoLineDialog classPrefix={classPrefix} {...contentProps} />,
        title,
        width,
    })
};

export default Dialog;