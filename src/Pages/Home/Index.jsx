import React, {useEffect, useState} from 'react'
import { compose } from '@bem-react/core'
import { Textinput } from '@yandex/ui/Textinput/desktop/bundle'
import { Button } from '@yandex/ui/Button/desktop/bundle'
import { Icon } from '@yandex/ui/Icon/desktop/bundle'
import "./Home.css"
import {Link} from "react-router-dom";
import searchIcon from '../../Assets/images/search.svg'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            fastSearchStyle: {},
            fastSearch: [],
            value: ''
        };
    }

    fsStyle () {
        const form = document.querySelector('.search_box');
        return {
            top: form.offsetTop + form.offsetHeight + 104 + 'px',
            left: form.offsetLeft + 8 + 'px',
        }
    }

    componentDidMount() {
        this.setState({fastSearchStyle: this.fsStyle()});
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
                this.setState({fastSearch: res});
            })
    }

    render() {
        const {value, fastSearch, fastSearchStyle} = this.state;
        return (
            <>
                <form style={{
                    margin: fastSearch ? 'calc(50vh - 200px) auto' : 'calc(50vh - 100px) auto'
                }} action="/search" className="search_box" method="get">
                    <Link to={`/`}>
                        <h1 className={`logo`}>picasso</h1>
                    </Link>
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
                            this.setState({...this.state, value: event.target.value});
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
                    <div style={fastSearchStyle} className={`fast_search`}>
                        {fastSearch?.map((res, index) => {
                            return (
                                <Link onClick={() => this.handleFsClick(res)}>{res}</Link>
                            )
                        })}
                    </div>
                )}

            </>
        )
    }
}

export default Home;