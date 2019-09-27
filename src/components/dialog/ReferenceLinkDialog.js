import React, { Component } from 'react';

class ReferenceLinkDialog extends Component {

    render() {

        const {
            classPrefix,
            selection,
        } = this.props;

        return (
            <div className={`${classPrefix}-form`}>
                <div className="form-group">
                    <label>引用名称</label>
                    <input type="text" data-name />
                </div>
                <div className="form-group">
                    <label>链接ID</label>
                    <input type="text" data-url-id />
                </div>
                <div className="form-group">
                    <label>链接地址</label>
                    <input type="text" data-url />
                </div>
                <div className="form-group">
                    <label>链接标题</label>
                    <input type="text" defaultValue={selection} data-title />
                </div>
            </div>
        )
    }
}

export default ReferenceLinkDialog;