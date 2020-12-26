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
app.use(express.static(path.join(__dirname, 'public')))

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

//get All Todos
app.get('/', async (req,res)=>{
    pool.on('error', (err)=>{
        console.error(err)
        process.exit(-1)
    })
    pool.connect((err, client, done)=>{
        if ( err ) throw err
        client.query('SELECT * FROM todos', (err, result)=>{
            done()
            if (err){
                console.log(err.stack)
            }else{
                console.log('connected')
                res.render('content', {layout: 'mainLayout', todos: result.rows})
            }
        })
    })
})

//add todos
app.post('/add', (req,res)=>{
    pool.connect((err, client, done)=>{
        if(err) return console.error(err)

        client.query('INSERT INTO todos (text) values ($1) returning *', [req.body.todoInputText])
        done()
        res.redirect("/")
    })
    }
)

app.listen(3000)