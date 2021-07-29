const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

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

// admin.database.enableLogging(true)

// app.get('/shelves', async (req, res) => {
//     try {
//         const ref = db.ref(shelfCollection);
//         const users = [];
//         ref.on('value',(snapshot)=>{
//             console.log(snapshot.val())
//             users.push(snapshot.val())
//         })
//         res.status(200).json(users);
//     } catch (error) {
//         console.log('error-error')
//         res.status(500).send(error);
//     }
// });

app.get('/')

app.listen(port, function() {
    console.log('app started');
});

