import React, { Component } from 'react';
import Item from './Item'

class List extends Component {

    list = () => {

        if (this.props.list.length) {
            return this.props.list.map(item =>
                <li key={item._id} className={this.props.selected._id === item._id ? 'selected' : null}  >
                    <Item value={item} remove={this.props.remove} update={this.props.update} select={this.props.select} />
                </li>)
        } else {
            return <h4 style={{ textAlign: 'center' }}>Empty</h4>
        }
    }

    render() {

        return (
            <div id="list">
                <h4 style={{ textAlign: 'center' }}>Saved Playgrounds</h4>
                <ul>
                    {this.list()}
                </ul>
            </div>
        )
    }
}


export default List;