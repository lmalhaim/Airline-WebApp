const express = require('express'); 
const cors = require("cors");
const homeRoutes = require('./server/routes/index'); 
const adminRoutes = require('./server/routes/admin'); 
const fs = require('fs');
const http = require('http');  

const app = express(); 

app.use(cors());
app.use(express.json()); //req.body


//fileSystems
app.use('/stylesheets', express.static('public/stylesheets')); 
app.use('/assets', express.static('public/assets')); 
app.use('/scripts', express.static('public/scripts')); 





app.use('/', homeRoutes); 
app.use('/admin', adminRoutes);


//app.use(express.static('public')); 


const port = process.env.PORT || 1385;

app.listen(port, () => console.log(`Listening on port ${port}...`));


/*
fs.readFile('./views/index/index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(port);
});*/


