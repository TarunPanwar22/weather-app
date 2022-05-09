const http = require("http");

const fs = require("fs");

var requests = require("requests");
const { join } = require("path");

const homeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempVal , orgVal) =>{
   let temperature = tempVal.replace("{%tempval%}" , orgVal.main.temp); 
   console.log("main ", orgVal.main)
   temperature = temperature.replace("{%tempmin%}" , orgVal.main.temp_min); 
   temperature = temperature.replace("{%tempmax%}" , orgVal.main.temp_max); 

   temperature = temperature.replace("{%location%}" , orgVal.name); 
   temperature = temperature.replace("{%country%}" , orgVal.sys.country); 
   temperature = temperature.replace("{%tempstatus%}" , orgVal.weather[0].main);
   return temperature;
}

const server = http.createServer((req, res) => {

    requests(`http://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=f76b0a228fabdada6d93af4352296630`)
        .on('data', function (chunk) {
            console.log(chunk);
            const objdata = JSON.parse(chunk);
            // console.log(JSON.stringify(objdata));
            const arrData = [objdata];
            console.log("arr darrData is " , arrData)
            // console.log(arrData[0].main.temp); 
            const realTimeData = arrData.map((val) => replaceVal(homeFile , val )).join("");
             res.write(realTimeData);
             console.log(realTimeData); 
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            console.log('end');
            res.end();
        });
})


server.listen(8000, "127.0.0.1");