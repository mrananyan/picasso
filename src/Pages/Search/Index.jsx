import React, {useEffect, useState} from 'react'
import { compose } from '@bem-react/core'
import { Textinput } from '@yandex/ui/Textinput/desktop/bundle'
import { Button } from '@yandex/ui/Button/desktop/bundle'
import { Icon } from '@yandex/ui/Icon/desktop/bundle'
import "./Search.css"
import {Link} from "react-router-dom";
import searchIcon from '../../Assets/images/search.svg'
import Photo from "../../Components/Photo/Photo";
import View from "../../Components/View/View";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            fastSearchStyle: {},
            fastSearch: [],
            value: this.getQuery(),
            photos: [],
            viewIndex: 0,
            pages: 0,
            page: 1,
            total: 0,
            related_searches: [],
            view: {}
        };
    }

    getQuery() {
        const url = new URLSearchParams(window.location.search);
        return url.get('q');
    }

    fsStyle () {
        const form = document.querySelector('.search_box');
        return {
            top: form.offsetTop + form.offsetHeight + 104 + 'px',
            left: form.offsetLeft + 8 + 'px',
        }
    }

    getPhotos(q,page){
        this.setState({page: page});
        fetch(`${process.env.REACT_APP_BACKEND}/api/search?q=${q}&page=${page}`)
            .then(res => res.json())
            .then(res => {
                this.setState({photos: [...this.state.photos, ...res.photos.results]});
                this.setState({pages: res.photos.total_pages});
                this.setState({total: res.photos.total});
                this.setState({related_searches: [...res.related_searches]});
            })
    }

    subscribeToScroll(){
        window.addEventListener('keyup', (e) => {
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 37:
                    // Left arrow
                    this.prevPhoto();
                    break;
                case 27:
                    // Close by esc
                    this.CloseView();
                    break;
                case 39:
                    // right
                    this.nextPhoto();
                    break;
                case 40:
                    // down
                    break;
            }
        });
        window.addEventListener('scroll', async () => {
            if (window.scrollY >= (window.innerHeight - 200) && this.state.pages >= this.state.page) {
                this.getPhotos(this.state.value, this.state.page + 1);
                await  sleep(2000)
            }
        })
    }

    componentDidMount() {
        if (!this.state.value) window.location = '/';
        this.setState({fastSearchStyle: this.fsStyle()});
        this.getPhotos(this.state.value, this.state.page);
        this.subscribeToScroll();
        window.addEventListener('resize', () => {
            this.setState({fastSearchStyle: this.fsStyle()});
        })
        window.addEventListener('click', (event) => {
            if(event.target.tagName !== 'INPUT'){
                this.setState({fastSearch: []});
            }
        })
    }

    handleFsClick (q) {
        this.setState({fastSearch: []})
        this.setState({value: q});
        document.querySelector('.search_box').submit();
    }

    handleFastSearch (q) {
        fetch(`${process.env.REACT_APP_BACKEND}/api/autocomplete?q=${q}`)
            .then(res => res.json())
            .then(res => {
                this.setState({fastSearch: [... res]});
            })
    }

    CloseView() {
        this.setState({view: {}});
    }

    prevPhoto() {
        if (!Object.keys(this.state.view).length) return;
        let index = (this.state.viewIndex + this.state.photos.length - 1) % this.state.photos.length;
        this.setState({
            view: {... this.state.view, ...this.state.photos[index]},
            viewIndex: index
        });
    }

    nextPhoto() {
        if (!Object.keys(this.state.view).length) return;
        let index = (this.state.viewIndex + this.state.photos.length + 1) % this.state.photos.length;
        if (index > this.state.photos.length - 10) {
            this.getPhotos(this.state.value, this.state.page + 1);
        }
        this.setState({
            view: {... this.state.view, ...this.state.photos[index]},
            viewIndex: index
        });
    }

    render() {
        const {value, fastSearch, fastSearchStyle} = this.state;
        window.document.title = `${value} - picasso high quality premium images free of charge`;
        return (
            <>
                <div className="header">
                    <Link to={`/`} className={`logo_a`}>
                        <h1 className={`logo`}>{window.innerWidth <= 800 ? 'P' : 'picasso'}</h1>
                    </Link>
                    <form action="/search" className="search_box" method="get">
                        <Textinput
                            iconLeft={<Icon url={searchIcon} />}
                            name={`q`}
                            hasClear={true}
                            className="search_input"
                            placeholder={`Search images around the world`}
                            size="m"
                            inputMode={`clear`}
                            pin={`clear-round`}
                            theme="websearch"
                            value={value}
                            onChange={(event) => {
                                this.setState({value: event.target.value});
                                this.handleFastSearch(event.target.value);
                            }}

                        />
                        <Button
                            className="search_button"
                            view="action"
                            theme={`websearch`}
                            size="m"
                            type={`submit`}
                            baseline={true}>
                            {window.innerWidth <= 800 ? 'Go' : 'Search'}
                        </Button>
                    </form>
                    {fastSearch.length > 0 && (
                        <div className={`fast_search`}>
                            {fastSearch?.map((res, index) => {
                                return (
                                    <Link key={index} to={`#`} onClick={() => this.handleFsClick(res)}>{res}</Link>
                                )
                            })}
                        </div>
                    )}
                </div>
                <div className="related_searches">
                    <p>Related keywords: <ul className="comma-list">{this.state.related_searches.map((res, index) => (
                        <li><Link key={index} to={`#`} onClick={() => this.handleFsClick(res.title)}>{res.title}</Link></li>
                    ))}</ul></p>
                </div>
                <div className="results">
                    {this.state.photos.map((item, index) => {
                        return (
                            <Photo
                                loading={`lazy`}
                                src={item.urls.thumb}
                                borderRadius={10}
                                onClick={() => {
                                    this.setState({
                                        view: item,
                                        viewIndex: index
                                    });
                                }}
                            />
                        )
                    })}
                    {!! Object.keys(this.state.view).length && (
                        <View
                            data={this.state.view}
                            close={() => this.CloseView()}
                            prevPhoto={() => {this.prevPhoto()}}
                            nextPhoto={() => {this.nextPhoto()}}
                        />
                    )}
                </div>
            </>
        )
    }
}

export default Search;
