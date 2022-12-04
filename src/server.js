const express = require('express')
const session = require('express-session')
const Api = require('./container/apiPord')
const api = new Api()
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
const {engine} = require('express-handlebars')
const app = express()

app.engine("handlebars",engine())

app.set("view engine","handlebars")
app.set("views","./views")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://fracaroFederico:fracaroFederico@cluster0.viv6icy.mongodb.net/sessions?retryWrites=true&w=majority',
        mongoOptions: advancedOptions
    }),
    secret: 'shhhhhhhhhhhhhhhhhhhhh',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 40000
    } 
}))

app.get('/', (req, res) => {
    if (req.session.nombre) {
        res.redirect('/produc')
    } else {
        res.redirect('/login')
    }
})

app.get('/login', (req, res) => {
    res.render("index")
})
app.post('/login',(req,res)=>{
    const nombre = req.body
    req.session.nombre = nombre
    res.redirect('/produc')
})
app.get('/produc',(req, res) => {
    let completeList=api.getAll()
    let user = req.session.nombre
    res.render("form",{completeList,user})
})
app.post('/produc',(req,res)=>{
    console.log(req.body)
    api.save(req.body)
    res.redirect("/produc")
})
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) res.redirect('/login')
        else res.send({ status: 'Logout ERROR', body: err })
    })
})


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${server.address().port}`);
})
server.on('error', error => console.log(`Error en servidor ${error}`))