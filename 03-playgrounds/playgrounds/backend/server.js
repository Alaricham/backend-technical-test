// Require

const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    axios = require('axios'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    Item = require('./models/item');

// ENV

const mongo = process.env.MONGO,
    googleKey = process.env.GOOGLE,
    openWKey = process.env.OPENW,
    port = process.env.PORT;

// Setup

require('dotenv').config();
app.use(bodyParser.json());
app.use(cors());
mongoose.connect(mongo);

// Functions

let weatherOrganizer = (data) => {

    let result = {},
        currentDate = '',
        currentArr = [];

    data.forEach((time, i) => {
        if (currentDate !== time['dt_txt'].slice(0, 10)) {
            if (i !== 0) {
                result[currentDate] = currentArr;
            }
            currentDate = time['dt_txt'].slice(0, 10);
            currentArr = [];
            currentArr.push(time);
        } else {
            currentArr.push(time);
        }
        result[currentDate] = currentArr;
    })
    return result
};

let checkUpdate = (data, itemToUpdate, res) => {

    if (itemToUpdate.hasOwnProperty('dates')) {
        updateWeatherData(data, itemToUpdate);
    } else {

        let { name, _id, vicinity, geometry } = itemToUpdate,
            updatedItem = { name, _id, vicinity, geometry, dates: data };

        Item.findByIdAndUpdate(updatedItem._id, updatedItem, (err, item1) => {
            if (err) {
                console.log(err);
            } else {
                Item.find({}, (err, list) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let item = updatedItem;
                        res.send({ list, item });
                    }
                })

            }
        });
    }
};

let updateWeatherData = (data, itemToUpdate) => {

    let dates = itemToUpdate.dates,
        change = false;

    for (let key in data) {
        if (!dates.hasOwnProperty(key)) {
            change = true;
            dates[key] = data[key];
        }
    }

    if (change) {

        let updatedItem = { ...itemToUpdate, dates };

        Item.findByIdAndUpdate(updatedItem._id, updatedItem, (err, item) => {
            if (err) {
                console.log(err);
            } else {
                Item.find({}, (err, list) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send({ list, item });
                    }
                })

            }
        });
    }
    return
};

// Routes

app.get('/find', (req, res) => {

    let { name, address } = req.query;

    axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?parameters',
        {
            params: {
                input: 'playground ' + name + " " + address,
                key: googleKey,
                inputtype: 'textquery'
            }
        })
        .then(results => {
            if (!results.data.candidates.length) {
                res.send('Not found');
            } else {
                axios.get('https://maps.googleapis.com/maps/api/place/details/json?parameters',
                    {
                        params: {
                            placeid: results.data.candidates[0]['place_id'],
                            key: googleKey
                        }
                    }).then(results => {

                        let { geometry, vicinity, name } = results.data.result,
                            item = { geometry, vicinity, name, placeId: results.data.result.place_id };

                        res.send(item);
                    })
            }
        });
});

app.get('/findByCoords', (req, res) => {

    let { lat, long, distance } = req.query;

    axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?parameters',
        {
            params: {
                location: lat + "," + long,
                radius: distance,
                key: googleKey,
                keyword: 'playground'
            }
        })
        .then(results => {
            if (results.data.status !== 'ZERO_RESULTS') {
                axios.get('https://maps.googleapis.com/maps/api/place/details/json?parameters',
                    {
                        params: {
                            placeid: results.data.results[0].place_id,
                            key: googleKey
                        }
                    }).then(results => {

                        let { geometry, vicinity, name } = results.data.result,
                            item = { geometry, vicinity, name };

                        res.send(item);
                    })
            } else {
                res.send('Not found');
            }
        });
});

app.post('/add', (req, res) => {

    let { item } = req.body;

    Item.create(item, (err, newItem) => {
        if (err) {
            console.log(err);
        } else {
            Item.find({}, (err, list) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(list);
                }
            })
        }
    });
});

app.get('/list', (req, res) => {

    Item.find({}, (err, list) => {
        if (err) {
            console.log(err);
        } else {
            res.send(list);
        }
    });
});

app.delete('/delete', (req, res) => {

    let item = req.body;

    Item.findByIdAndRemove(item.id, (err, itemDeleted) => {
        if (err) {
            console.log(err);
        } else {
            Item.find({}, (err, list) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(list);
                }
            })
        }
    });
});

app.put('/update', (req, res) => {

    let { item } = req.body.data;

    Item.findByIdAndUpdate(item._id, item, (err, updatedItem) => {
        if (err) {
            console.log(err);
        } else {
            Item.find({}, (err, list) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(list);
                }
            })

        }
    });
});

app.get('/weather', (req, res) => {

    let geometry = JSON.parse(req.query.geometry),
        { lat, lng } = geometry.location,
        url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat.toString()}&lon=${lng.toString()}&APPID=${openWKey}`;

    axios.get(url).then(results => {

        let dateData = weatherOrganizer(results.data.list);

        Item.findById(req.query._id, (err, item) => {
            if (err) {
                console.log(err);
            } else {
                checkUpdate(dateData, item, res);
            }
        })
    });
});

app.listen(port, () => console.log('Server started...'));

