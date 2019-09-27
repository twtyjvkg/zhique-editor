import React, { Component } from 'react';
import Viewer from 'viewerjs';

import 'viewerjs/dist/viewer.css';

class Root extends Component {

    body = React.createRef();

    componentDidMount() {
        new Viewer(this.body.current, {
            button: false,
            navbar: false,
            toolbar: false,
            fullscreen: false,
            movable: false,
        });
    }

    render() {
        const { children, className } = this.props;
        return (
            <article ref={this.body} className={className}>
                {children}
            </article>
        )
    }
}

export default Root;