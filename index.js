let express = require('express')
let fs = require('fs')
let layouts = require('express-ejs-layouts')
let methodOverride = require('method-override')

let app = express()

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(layouts)
//body-parser
// QUESTION:  WHY DOES IT RESPOND AS "UNDEFINED" console.log(req.body)
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/dinosaurs', (req, res) => {
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    let nameFilter = req.query.nameFilter

    if (nameFilter) {
        //Filtering over my dinoData array, only returning values that have matched what I input in my "nameFilter"
        dinoData = dinoData.filter(dino => {
            return dino.name.toLowerCase() === nameFilter.toLowerCase()
        })
    }


    res.render('dinosaurs/index', {myDinos: dinoData})
})

app.get('/dinosaurs/new', (req, res) => {
    res.render('dinosaurs/new')
})

app.get('/dinosaurs/:idx', (req, res) => {
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    let dinoData = JSON.parse(dinosaurs)
    let dinoIndex = parseInt(req.params.idx)

    res.render('dinosaurs/show', {myDino: dinoData[dinoIndex]})
})

app.post('/dinosaurs', (req, res) => {
    // console.log(req.body)
    //READ DINOSAURS FILE
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    dinosaurs = JSON.parse(dinosaurs)
    //ADD THE NEW CONTENT TO THE DINOSAURS ARRAY
    dinosaurs.push(req.body)
    //SAVE THE NEW ARRAY CONTENT TO DINOSAURS.JSON
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs))
    //REDIRECT TO THE /DINOSAURS
    res.redirect('/dinosaurs')
})

app.delete('/dinosaurs/:idx', (req, res) => {
    let dinosaurs = fs.readFileSync('./dinosaurs.json')
    dinosaurs = JSON.parse(dinosaurs)
    //remove the selected dinosaur from our 'dinosaurs' array
    dinosaurs.splice(req.params.idx, 1)
    //save over our dinosaurs.json with the newly formatted dinosaurs array
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs))
    //once everything is done, we want to show the user the impact of his actions by redirecting to the /dinosaurs route to see all remaining dinosaurs
    res.redirect('/dinosaurs')
})

app.listen(3000, () => {console.log('🦕Singin and Dancin on Port 3000🦕')})