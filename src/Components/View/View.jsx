import React from "react";
import "./View.css";
import Photo from "../Photo/Photo";
import {Image} from "@yandex/ui/Image/desktop";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            prev: props.prev,
            next: props.next
        }
    }

    render() {
        const { close, nextPhoto } = this.props;
        const {prev, data, next} = this.state.data;
        console.info('ptrv', prev)
        console.info('data', data)
        console.info('next', next)
        return (
            <div className={`view_bg`} onClick={() => close()}>
                <div className="view_wrap">
                    <div className="view_content">
                        <Image
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                nextPhoto(next);
                            }}
                            className={`view_photo`}
                            loading={`lazy`}
                            src={data.urls.full}
                            borderRadius={15}>
                            <h1>Yo!</h1>
                        </Image>

                    </div>
                </div>
            </div>
        )
    }
}

export default View;
