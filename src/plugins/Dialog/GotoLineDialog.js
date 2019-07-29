import React, { Component } from 'react';

class GotoLineDialog extends Component {

    render() {

        const {
            classPrefix,
            lineCount
        } = this.props;

        return (
            <div className={`${classPrefix}-form`} style={{ padding: '10px 0' }}>
                <p style={{ margin: 0 }}>
                    请输入行号 1-{lineCount}&nbsp;&nbsp;&nbsp;
                    <input
                        type="number"
                        className="number-input"
                        style={{ width: 60 }}
                        defaultValue={1}
                        max={lineCount}
                        data-line-number
                    />
                </p>
            </div>
        );
    }
}

export default GotoLineDialog;