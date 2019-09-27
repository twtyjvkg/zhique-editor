import React, { Component } from 'react';

import Icon from '../icon';

const list = [
    {
        icon: 'align-left',
        label: '左对齐',
        value: 'left'
    },
    {
        icon: 'align-center',
        label: '居中对齐',
        value: 'center'
    },
    {
        icon: 'align-right',
        label: '右对齐',
        value: 'right'
    },
];

class TableDialog extends Component {

    render() {

        const {
            classPrefix,
        } = this.props;

        return (
            <div className={`${classPrefix}-form`}>
                <div className="form-group">
                    <label>单元格数</label>
                    <input
                        type="number"
                        defaultValue={3}
                        className="number-input"
                        min={2}
                        max={100}
                        style={{ width: 40 }}
                        data-rows
                    />
                    <label>列数</label>
                    <input
                        type="number"
                        defaultValue={2}
                        className="number-input"
                        style={{ width: 40 }}
                        max={100}
                        min={1}
                        data-cols
                    />
                </div>
                <div className="form-group">
                    <label>对齐方式</label>
                    <div className="align-type-list">
                        {list.map(({ icon, label, value }, index) => (
                            <a>
                                <label htmlFor={`${classPrefix}-table-dialog-radio${index}`} title={label}>
                                    <input
                                        type="radio"
                                        name="table-align"
                                        id={`${classPrefix}-table-dialog-radio${index}`}
                                        defaultValue={value}
                                        defaultChecked={index === 0 ? 'checked' : ''}
                                    />
                                    <Icon type={icon} />
                                </label>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        )

    }
}

export default TableDialog;