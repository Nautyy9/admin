const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
// enableWs(app)
const port = 8080;
app.use(cors({ origin: true }));


var serviceAccount = require('./admin.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Or credential
    databaseURL: 'https://deerika-smart-store-rdb-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const db = admin.database()
const shelfCollection = 'dummydata/smart-shelves';

var client = mqtt.connect("mqtt://broker.hivemq.com")
client.on("connect",function(){	
    console.log("connected");
})

app.post('/add_product', (req, res) => {
    client.publish('admin/shelve1/',JSON.stringify(req.body),error => {
        if (error) {
            res.send(error)
        }
    });
    res.send('Added Successfully')
})

app.listen(port, function() {
    console.log('app started');
});

