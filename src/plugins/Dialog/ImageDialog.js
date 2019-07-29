import React, {Component, Fragment} from 'react';

class ImageDialog extends Component {

    filePath = React.createRef();

    handleFileChange = e => {
        const { action } = this.props;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        fetch(action, {
            method: 'post',
            body: formData
        })
            .then(response => response.json())
            .catch(error => console.log(error))
            .then(response => {
                const filePath = this.filePath.current;
                filePath.value = `${action}?image_id=${response.file_id}`;
            })
    };

    render() {

        const {
            classPrefix,
            imageUpload,
            selection
        } = this.props;

        return (
            <div className={`${classPrefix}-form`}>
                <div>
                    <label>图片地址</label>
                    <input type="text" ref={this.filePath} data-url />
                    {imageUpload && (
                        <div className={`${classPrefix}-file-input`}>
                            <input onChange={this.handleFileChange} type="file" name={`${classPrefix}-image-file`} accept="image/*" />
                            <input type="submit" value="本地上传" />
                        </div>
                    )}
                </div>
                <div>
                    <label>图片描述</label>
                    <input type="text" defaultValue={selection} data-alt />
                </div>
                <div>
                    <label>图片链接</label>
                    <input type="text" defaultValue="http://" data-link />
                </div>
            </div>
        )
    }
}

export default ImageDialog;