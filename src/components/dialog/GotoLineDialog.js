import React, { Component } from 'react';

class GotoLineDialog extends Component {

    render() {

        const {
            classPrefix,
            lineCount
        } = this.props;

        return (
            <div className={`${classPrefix}-form`}>
                <div className="form-group">
                    <label style={{ width: 120 }}>请输入行号 1-{lineCount}</label>
                    <input
                        type="number"
                        className="number-input"
                        style={{ width: 190 }}
                        defaultValue={1}
                        max={lineCount}
                        data-line-number
                    />
                </div>
            </div>
        )

    }
}

export default GotoLineDialog;