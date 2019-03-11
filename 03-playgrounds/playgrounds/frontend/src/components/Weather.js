import React, { Component } from 'react';

class Weather extends Component {

    render() {

        let Obj = this.props.selected.dates,
            list = [];

        for (let key in Obj) {
            list.push(Obj[key])
        }

        let newList = list.map(day => {

            let forecast = day.map(time => <p >{time.dt_txt.slice(12, time.dt_txt.length - 3)} - {time.weather[0].description}  </p>),
                date = day[0].dt_txt.slice(0, 10)

            return (
                <div className="dayList" style={{ width: '200px', display: 'inline-block', verticalAlign: 'top' }} key={(new Date()).getTime() + date}>
                    <p style={{ textAlign: 'center' }}><strong>{date}</strong></p>
                    <div>{forecast}</div>
                </div>)
        })

        return (
            <div id="weather"  >
                <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                    <h4 >Weather Forecast</h4>
                    <button disabled={this.props.selected.name ? false : true} onClick={this.props.getWeather}>Get Weather</button>
                </div>
                <div id='weatherlist' style={{ margin: '10px' }}>
                    <div style={{ width: ((list.length * 200).toString() + 'px') }}>
                        {newList}
                    </div>
                </div>
            </div>

        )
    }
}

export default Weather;