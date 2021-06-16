const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
var _ = require('lodash');
const { lastIndexOf } = require("lodash");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

const CO2Values =
    [{ time: "0", value: 350 },
    { time: "10", value: 1000 },
    { time: "20", value: 1750 },
    { time: "30", value: 2500 },
    { time: "40", value: 3750 },
    { time: "50", value: 5000 }]

app.get("/getData", (req, res) => {
    res.send(CO2Values);
});

app.post("/postData", (req, res) => {
    const lastItem = req.body[req.body.length - 1];
    var randomNo = Math.floor(Math.random() * 5000);
    let myTime = 10;
    let array = [
        {
            time: (Number(lastItem.time) + myTime).toString(),
            value: Number(randomNo)
        }
    ];
    array = [...req.body, ...array];
    _.sortBy(array, ['time', 'value']);
    res.send(array);
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));