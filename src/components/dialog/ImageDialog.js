import React, { Component } from 'react';

class ImageDialog extends Component {

    urlInput = React.createRef();

    handleFileChange = e => {
        const { onImageSelect } = this.props;
        if (onImageSelect) {
            onImageSelect(e, this.urlInput.current)
        }
    };

    render() {

        const {
            classPrefix,
            selection,
            onImageSelect
        } = this.props;

        return (
            <div className={`${classPrefix}-form`}>
                <div className="form-group">
                    <label>图片地址</label>
                    <input type="text" data-url ref={this.urlInput} style={{ width: onImageSelect ? 240 : 325 }} />
                    {onImageSelect && (
                        <div className={`${classPrefix}-file-input`}>
                            <input onChange={this.handleFileChange} type="file" name={`${classPrefix}-image-file`} accept="image/*" />
                            <input type="submit" value="本地上传" />
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>图片描述</label>
                    <input type="text" defaultValue={selection} data-alt style={{ width: 325 }} />
                </div>
                <div className="form-group">
                    <label>图片链接</label>
                    <input type="text" defaultValue="http://" style={{ width: 325 }} data-link />
                </div>
            </div>
        )
    }
}

export default ImageDialog;
