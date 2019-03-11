import React, { Component } from 'react';
import axios from 'axios'

class SearchBox extends Component {

    state = {
        found: []
    }

    nameBar = React.createRef();
    addressBar = React.createRef();
    lat = React.createRef();
    long = React.createRef();
    distance = React.createRef();

    input = () => {

        let name = this.nameBar.current.value,
            address = this.addressBar.current.value;

        if (name.length > 0 && address.length > 0 && typeof name === 'string' && typeof address === 'string') {

            axios.get('http://localhost:3000/find', { params: { name, address } })
                .then(results => {
                    if (results.data === "Not found") {
                        alert('No result found. Please try with more information.');
                    } else {
                        this.setState({ found: results.data });
                    }
                })

        } else {
            alert('Please fill in inputs correctly');
        }
    }

    searchByCoords = () => {

        let lat = this.lat.current.value,
            long = this.long.current.value,
            distance = this.distance.current.value;

        if (lat.length > 0 && long.length > 0 && distance.length > 0) {
            axios.get('http://localhost:3000/findByCoords', { params: { lat, long, distance } })
                .then(results => {
                    if (results.data === "Not found") {
                        alert('No result found. Please try again.');
                    } else {
                        this.setState({ found: results.data });
                    }
                })
        } else if (distance.length > 500) {
            alert('500 meters is the limit. Please input a lower value');
        } else {
            alert('Please fill in inputs correctly');
        }
    }

    render() {

        return (
            < div id='searchBar' >
                <div>
                    <h4>Search by Name/Address</h4>
                    <input ref={this.nameBar} placeholder="Name"></input>
                    <input ref={this.addressBar} placeholder="Address"></input>
                    <button style={{ margin: '10px' }} onClick={this.input} id="searchBtn">  Search</button>
                </div>
                <div style={{ margin: '10px' }}>
                    <h4>Search by Coordinates</h4>
                    <input type="number" ref={this.lat} placeholder="Latitude" style={{ width: '100px' }}></input>
                    <input type="number" ref={this.long} placeholder="Longitude" style={{ width: '100px' }}></input>
                    <input type="number" ref={this.distance} placeholder="Distance-meters" style={{ width: '140px' }}></input>
                    <button style={{ margin: '10px' }} onClick={this.searchByCoords}>Search</button>
                </div>
                <div id="result">
                    {this.state.found.name ?
                        <h5>{this.state.found.name} {this.state.found.vicinity} {this.state.found.geometry.location.longitude}</h5> :
                        <h5>Empty</h5>}
                </div>
                <button disabled={this.state.found ? false : true} onClick={() => this.props.add(this.state.found)} id='save'>Save Data</button>
            </div >
        )
    }
}

export default SearchBox;