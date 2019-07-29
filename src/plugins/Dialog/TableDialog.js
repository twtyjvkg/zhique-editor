import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight} from "@fortawesome/free-solid-svg-icons";

class TableDialog extends Component {

    render() {

        const {
            classPrefix,
            labels,
            icons,
            values
        } = this.props;

        return (
            <div className={`${classPrefix}-form`} style={{ padding: '13px 0' }}>
                <div>
                    <label>单元格数</label>
                    行数 <input
                    type="number"
                    defaultValue={3}
                    className="number-input"
                    style={{ width: 40 }}
                    max={100}
                    min={2}
                    data-rows
                />&nbsp;&nbsp;
                    列数 <input
                    type="number"
                    defaultValue={2}
                    className="number-input"
                    style={{ width: 40 }}
                    max={100}
                    min={1}
                    data-cols
                />
                </div>
                <div>
                    <label>对齐方式</label>
                    <div className="fa-btns">
                        {values.map((value, index ) => (
                            <a>
                                <label htmlFor={`${classPrefix}-table-dialog-radio${index}`} title={labels[index]}>
                                    <input
                                        type="radio"
                                        name="table-align"
                                        id={`${classPrefix}-table-dialog-radio${index}`}
                                        defaultValue={value}
                                        defaultChecked={index === 0 ? 'checked' : ''}
                                    />
                                    <i>
                                        <FontAwesomeIcon icon={icons[index]} />
                                    </i>
                                </label>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

TableDialog.defaultProps = {
    icons: [
        faAlignJustify,
        faAlignLeft,
        faAlignCenter,
        faAlignRight
    ],
    labels: [
        '默认',
        '左对齐',
        '居中对齐',
        '右对齐'
    ],
    values: [
        'default',
        'left',
        'center',
        'right'
    ]
};

export default TableDialog;