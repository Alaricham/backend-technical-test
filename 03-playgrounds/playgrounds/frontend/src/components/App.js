import React, { Component } from 'react';
import '../css/App.css';
import axios from 'axios'
import GoogleApiWrapper from './GoogleApiWrapper'
import SearchBox from './SearchBox';
import List from './List'
import ExtraInfo from './ExtraInfo';
import Weather from './Weather'

class App extends Component {

    state = {
        list: [],
        selected: {}
    }

    add = (item) => {

        axios.post('http://localhost:3000/add', { item })
            .then(payload => {
                this.setState({ list: payload.data });
            })
    }

    getWeather = () => {

        let item = { ...this.state.selected };

        axios.get('http://localhost:3000/weather', { params: item })
            .then(payload => {
                this.setState({ list: payload.data.list, selected: payload.data.item });
            })
    }

    remove = event => {

        let id = event.target.parentNode.id;

        axios.delete('http://localhost:3000/delete', { data: { id } })
            .then(payload => {
                this.setState({ list: payload.data, selected: {} });
            })
    }

    select = item => this.setState({ selected: item })

    update = item => {

        axios.put('http://localhost:3000/update', { data: { item } })
            .then(payload =>
                this.setState({ list: payload.data }))
    }

    componentDidMount() {

        axios.get('http://localhost:3000/list').then(payload => {
            this.setState({ list: payload.data });
        })

    }

    render() {

        return (
            <div className="App">
                <GoogleApiWrapper list={this.state.list} selected={this.state.selected} />
                <SearchBox add={this.add} />
                <List list={this.state.list} remove={this.remove} update={this.update} select={this.select} selected={this.state.selected} />
                <Weather selected={this.state.selected} getWeather={this.getWeather} />
                <ExtraInfo selected={this.state.selected} />
            </div>
        );
    }
}

export default App;
