import React, { Component } from 'react';
import axios from 'axios'

class ExtraInfo extends Component {

    state = { data: {} }

    componentWillReceiveProps() {
        this.setState({ data: {} });
    }

    find = () => {

        axios.get('https://maps.googleapis.com/maps/api/place/details/json?parameters',
            {
                params: {
                    placeid: this.props.selected.placeId,
                    key: process.env.REACT_APP_GOOGLE
                }
            }).then(payload => {
                this.setState({ data: payload.data.result });
            })
    }

    render() {

        let userRatings;

        if (this.state.data.reviews) {
            userRatings = this.state.data.reviews.map(user => {
                return (<div key={(new Date()).getTime()}>
                    <p><strong>{user.author_name}</strong></p>
                    <p>Rating: {user.rating}</p>
                    <p>{user.text}</p>
                </div>)

            })
        }
        return (
            <div className="info" >
                <div style={{ textAlign: 'center' }} >
                    <h4 >User Playground Reviews</h4>
                    <button disabled={this.props.selected.name ? false : true} onClick={this.find}>Get information</button>
                </div>
                {this.state.data.reviews &&
                    <div id="comments" >
                        <div style={{ height: ((this.state.data.reviews.length * 50).toString() + 'px') }}>
                            {userRatings}
                        </div>
                    </div>}
            </div >)
    }
}

export default ExtraInfo;