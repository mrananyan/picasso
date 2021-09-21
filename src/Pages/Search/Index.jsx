import React, {useEffect, useState} from 'react'
import { compose } from '@bem-react/core'
import { Textinput } from '@yandex/ui/Textinput/desktop/bundle'
import { Button } from '@yandex/ui/Button/desktop/bundle'
import { Icon } from '@yandex/ui/Icon/desktop/bundle'
import "./Search.css"
import {Link} from "react-router-dom";
import searchIcon from '../../Assets/images/search.svg'
import Photo from "../../Components/Photo/Photo";

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
            pages: 0,
            page: 1,
            total: 0,
            related_searches: []
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
        fetch(`http://localhost/api/search?q=${q}&page=${page}`)
            .then(res => res.json())
            .then(res => {
                this.setState({photos: [...this.state.photos, ...res.photos.results]});
                this.setState({pages: res.photos.total_pages});
                this.setState({total: res.photos.total});
                this.setState({related_searches: [...res.related_searches]});
            })
    }

    subscribeToScroll(){
        window.addEventListener('scroll', () => {
            if (window.scrollY >= (window.innerHeight - 200) && this.state.pages >= this.state.page) {
                this.getPhotos(this.state.value, this.state.page++);
                sleep(4000)
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
        this.setState({value: q});
        this.setState({fastSearch: []})
        setTimeout(function (){
            document.querySelector('.search_box').submit();
        }, 1500)
    }

    handleFastSearch (q) {
        fetch(`http://localhost/api/autocomplete?q=${q}`)
            .then(res => res.json())
            .then(res => {
                this.setState({fastSearch: [... res]});
            })
    }

    render() {
        const {value, fastSearch, fastSearchStyle} = this.state;
        return (
            <>
                <div className="header">
                    <Link to={`/`} className={`logo_a`}>
                        <h1 className={`logo`}>picasso</h1>
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
                            Search
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
                    <p>related keywords: <ul className="comma-list">{this.state.related_searches.map((res, index) => (
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
                            />
                        )
                    })}
                </div>
            </>
        )
    }
}

export default Search;