import React, { Component } from 'react';

class LinkDialog extends Component {

    render() {

        const {
            classPrefix,
            selection
        } = this.props;

        return (
          <div className={`${classPrefix}-form`}>
              <div className="form-group">
                  <label>链接地址</label>
                  <input type="text" defaultValue="http://" data-url />
              </div>
              <div className="form-group">
                  <label>链接标题</label>
                  <input type="text" defaultValue={selection} data-title />
              </div>
          </div>
        );
    }
}

export default LinkDialog;