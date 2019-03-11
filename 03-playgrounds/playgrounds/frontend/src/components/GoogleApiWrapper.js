import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import React, { Component } from 'react'

export class MapContainer extends Component {

    state = { lat: 0, lng: 0 }
    mapGoogle = React.createRef();

    componentDidMount() {
        this.mapGoogle.current.firstChild.className = 'map';
    }

    render() {

        let mappedMarkers, lat, lng;

        if (this.props.list.length) {
            mappedMarkers = this.props.list.map(marker =>
                <Marker key={(new Date()).getTime() + Math.random() * 1000} title={marker.name} position={{ lat: marker.geometry.location.lat, lng: marker.geometry.location.lng }} />)
        }
        if (this.props.selected.geometry) {

            let location = this.props.selected.geometry.location;

            lat = location.lat;
            lng = location.lng;
        }
        return (
            <div ref={this.mapGoogle} className="map">
                <Map
                    ref={this.mapGoogle}
                    google={this.props.google} zoom={15}
                    style={{ width: '500px', height: '500px', position: 'absolute', left: '900px' }}
                    center={{ lat, lng }}>
                    {mappedMarkers !== undefined ? mappedMarkers : null}
                </Map >
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE,
})(MapContainer)