import React from 'react';
import { Image } from '@yandex/ui/Image/desktop';
import './Photo.css';

class Photo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Image className={`thumb_photo`} {...this.props}>
                <h1>Yo!</h1>
            </Image>
        )
    }
}

export default Photo