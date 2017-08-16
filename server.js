


const express = require('express')
const bodyParser = require('body-parser')
const app = express()


// Extract data from the form and add to body property of request object.
app.use(bodyParser.json())

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('CoursePlanner.db')

const axios = require('axios')


console.log("Node server up!")


app.listen(3000, ()=> {
    console.log('Now listening on 3000')
})


app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html')
})



app.post('/api/database', (req, res)=> {
    console.log("req + body")
    console.log(req.body)

    code = req.body.code.toUpperCase()


    db.get("SELECT * FROM SubjectInfo WHERE unit_code = ?", {
        1: code }, (err, row) => {
            if (err) {
                console.log(error)
                res.send("error msg from api")
            } else {
                console.log(row)
                res.json(row)
            }
    })

    //

})




app.get('/axios', (req, res)=> {
    res.send("Axios response")
})

app.get('/app.js', (req, res)=> {
    res.sendFile(__dirname + '/app.js')
})

app.get('/node_modules/bulma/css/bulma.css', (req, res)=> {
    res.sendFile(__dirname + '/node_modules/bulma/css/bulma.css')
})

app.get('/node_modules/vue/dist/vue.js', (req, res)=> {
    res.sendFile(__dirname + '/node_modules/vue/dist/vue.js')
})

app.get('/node_modules/axios/dist/axios.js', (req, res)=> {
    res.sendFile(__dirname + '/node_modules/axios/dist/axios.js')
})

app.get('/node_modules/font-awesome/dist/icons.less', (req, res)=> {
    res.sendFile(__dirname + '/node_modules/font-awesome/dist/icons.less')
})


// app.post('/test', (req, res)=> {
//
//     console.log(req.body.code)
//
//     params = {
//         TableName: 'Subjects',
//         Key: { 'code' : req.body.code }
//     }
//
//     db.get(params, (err, data) => {
//         if (err) {
//             console.error("Unable to read item. Error: ", JSON.stringify(err, null, 2))
//         } else {
//             console.log("GetItem succeeded: ", JSON.stringify(data, null, 2))
//         }
//         res.redirect('/')
//     })
//
// })


// app.get('/test_db', (req, res)=> {
//
//     // console.log(req.body)
//
//     params = {
//         TableName: 'Subjects',
//         Key: { 'code' : 'WRIT6001' }
//     }
//
//     db.get(params, (err, data) => {
//         if (err) {
//             console.error("Unable to read item. Error: ", JSON.stringify(err, null, 2))
//         } else {
//             console.log("GetItem succeeded: ", JSON.stringify(data, null, 2))
//         }
//         res.redirect('/')
//     })
// })
