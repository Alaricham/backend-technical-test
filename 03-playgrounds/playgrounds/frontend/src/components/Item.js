import React, { Component } from 'react';

class Item extends Component {

    state = {
        name: this.props.value.name,
        vicinity: this.props.value.vicinity,
        lat: this.props.value.geometry.location.lat,
        lng: this.props.value.geometry.location.lng
    }

    upload = () => {

        let { name, vicinity, lat, lng } = this.state,
            item = { ...this.props.value, name, vicinity, geometry: { location: { lat, lng } } };

        this.props.update(item);
    }

    render() {

        return (
            <div id={this.props.value._id} onChange={this.update} onClick={() => this.props.select(this.props.value)}>
                <input defaultValue={this.props.value.name} onChange={event => this.setState({ name: event.target.value })}></input>
                <input defaultValue={this.props.value.vicinity} onChange={event => this.setState({ vicinity: event.target.value })}></input>
                <input style={{ width: '140px' }} defaultValue={this.props.value.geometry.location.lat} onChange={event => this.setState({ lat: event.target.value })}></input>
                <input style={{ width: '140px' }} defaultValue={this.props.value.geometry.location.lng} onChange={event => this.setState({ lng: event.target.value })}></input>
                <button style={{ marginRight: '10px' }} onClick={this.props.remove}>Remove</button>
                <button onClick={this.upload}>Update</button>
            </div>)
    }
}

export default Item;