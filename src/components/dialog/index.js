import React, {Component, Fragment} from 'react';
import ReactDom from 'react-dom';
import classNames from 'classnames';

import ImageDialog from "./ImageDialog";
import LinkDialog from "./LinkDialog";
import ReferenceLinkDialog from "./ReferenceLinkDialog";
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
            content,
            footer,
        } = this.props;

        return (
            <Fragment>
                {title && (
                    <div className={`${classPrefix}-dialog-header`}>
                        <strong className={`${classPrefix}-dialog-title`}>{title}</strong>
                    </div>
                )}
                <div className={`fa ${classPrefix}-dialog-container`}>
                    {content}
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

Dialog.defaultProps = {
    width: 420,
    height: 240,
    zIndex: 99999,
};

Dialog.showDialog = props => {
    const { classPrefix, editor, ...dialogProps } = props;
    let div = document.createElement('div');
    div.setAttribute('class', `${classPrefix}-dialog`);
    editor.appendChild(div);
    return ReactDom.render(React.createElement(Dialog, {
        ...dialogProps,
        classPrefix,
        editor,
        container: div,
    }), div);
};

Dialog.showLinkDialog = props => {
  const {
      classPrefix,
      content,
      ...dialogProps
  } = props;
  return Dialog.showDialog({
      classPrefix,
      title: '添加链接',
      width: 380,
      height: 211,
      content: <LinkDialog classPrefix={classPrefix} {...content} />,
      ...dialogProps
  })
};

Dialog.showReferenceLinkDialog = props => {
    const {
        classPrefix,
        content,
        ...dialogProps
    } = props;
    return Dialog.showDialog({
        classPrefix,
        title: '添加引用链接',
        width: 380,
        height: 296,
        content: <ReferenceLinkDialog classPrefix={classPrefix} {...content} />,
        ...dialogProps
    })
};

Dialog.showImageDialog = props => {
  const {
      classPrefix,
      onImageSelect,
      content,
      ...dialogProps
  } = props;
  return Dialog.showDialog({
      classPrefix,
      title: '添加图片',
      width: 465,
      content: <ImageDialog onImageSelect={onImageSelect} classPrefix={classPrefix} {...content} />,
      ...dialogProps
  })
};

Dialog.showTableDialog = props => {
  const {
      classPrefix,
      content,
      ...dialogProps
  } = props;
    return Dialog.showDialog({
        classPrefix,
        content: <TableDialog classPrefix={classPrefix} {...content} />,
        title: '添加表格',
        width: 360,
        ...dialogProps
    })
};

Dialog.showGotoLineDialog = props => {
  const {
      classPrefix,
      content,
      ...dialogProps
  } = props;
  return Dialog.showDialog({
      classPrefix,
      content: <GotoLineDialog classPrefix={classPrefix} {...content} />,
      title: '跳转到行',
      width: 400,
      ...dialogProps
  })
};


export default Dialog;