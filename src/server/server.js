const express = require('express'); 
const app = express();
const path = require("path");
const PORT = 3000;
const cors = require('cors');
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api.js");
const formData = require('express-form-data')



app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(formData.parse())


app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
});
