const express = require('express')
const hbs = require('handlebars')
const exhbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const pg = require('pg')
const { Pool } = require('pg')

const app = express()

//view engine hbs
app.set('view engine', 'hbs')

app.engine('hbs', exhbs({
    layoutsDir: __dirname+'/views/layouts',
    extname: 'hbs',
    defaultLayout: 'mainLayout'
}))

//public folder
app.use(express.static(path.join(__dirname + 'public')))

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//pg pool obj
const pool = new Pool({
    user: 'postgres',
    database: 'tododb',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
})

//getAllTodos

app.get('/', (req,res)=>{
    pool.on('error', (err, client)=>{
        console.error(err)
        process.exit(-1)
    })
})