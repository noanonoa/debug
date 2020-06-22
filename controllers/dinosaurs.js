let express = require('express')
let router = express.Router()

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

module.exports = router