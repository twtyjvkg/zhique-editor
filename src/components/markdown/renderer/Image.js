import React, { Component } from 'react';

class Image extends Component {

    render() {
        const { alt, src, title } = this.props;
        return (
            <img style={{ cursor: 'pointer' }} alt={alt} src={src} title={title} />
        )
    }

}
export default Image;