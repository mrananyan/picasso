import React from "react";
import "./View.css";
import {Image} from "@yandex/ui/Image/desktop";
import HammerComponent from "react-hammerjs";

class View extends React.Component {
    isTouchScreen() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    download(e) {
        e.preventDefault();
        fetch(e.target.href, {
            method: "GET",
            headers: {}
        })
            .then(response => {
                response.arrayBuffer().then(function(buffer) {
                    const url = window.URL.createObjectURL(new Blob([buffer]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `${window.document.title} #${(new Date()).getTime()}.jpg`); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { close, prevPhoto, nextPhoto, data } = this.props;
        return (
            <div className={`view_bg`} onClick={() => {
                close();
            } }>
                <HammerComponent
                    onSwipeRight={(e) => {
                        prevPhoto();
                    }}
                    onSwipeLeft={(e) => {
                        nextPhoto();
                    }}
                    onSwipeUp={(e) => {
                        close();
                    }}
                    onSwipeDown={(e) => {
                        close();
                    }}
                >
                <div className="view_wrap">
                    <div className="view_content">
                        <Image
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!this.isTouchScreen()) nextPhoto();
                            }}
                            className={`view_photo`}
                            loading={`eager`}
                            src={(process.env.REACT_APP_IMAGE_QUALITY.toLowerCase() === 'high') ? data?.urls?.full : data?.urls?.small }
                            borderRadius={15} />
                        <div className="controll"> Download as:
                            <a href={data?.urls?.raw} target={`_blank`} onClick={e => {
                                e.stopPropagation();
                                this.download(e);
                            }} download>RAW</a> |
                            <a href={data?.urls?.full} target={`_blank`} onClick={e => {
                                e.stopPropagation();
                                this.download(e);
                            }}  download>Full</a>
                        </div>
                    </div>
                </div>
                </HammerComponent>
            </div>
        )
    }
}

export default View;
