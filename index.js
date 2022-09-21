const http = require('http');
const fs = require('fs');

var requests = require('requests');
const host = 'localhost';
const port = 3000;

const homFile = fs.readFileSync("home.html","utf-8");

const replacePune = (tempVal, orgVal) => {
    let temp = (orgVal.main.temp)-273.15;
    let temp_max = (orgVal.main.temp_max)-273.15;
    let temp_min = (orgVal.main.temp_min)-273.15;
    let temperature = tempVal.replace("{%tempval%}",temp.toFixed(2));
    temperature = temperature.replace("{%city%}",orgVal.name);
    temperature = temperature.replace("{%status%}",orgVal.weather[0].main);
    let tem_status = orgVal.weather[0].main;
    if(tem_status == "Clouds"){
       temperature = temperature.replace("{%img%}","https://img.icons8.com/office/80/000000/partly-cloudy-day.png"); 
    }
    if(tem_status == "Rain"){
        temperature = temperature.replace("{%img%}","https://www.freeiconspng.com/uploads/cloud-rain-icon-2.png");
        
     }
     else{
        temperature = temperature.replace("{%img%}","https://img.icons8.com/emoji/96/000000/sun-emoji.png");
     }
     if(tem_status == "Clouds"){
        temperature = temperature.replace("{%img1%}","https://img.icons8.com/office/80/000000/partly-cloudy-day.png"); 
     }
     if(tem_status == "Rain"){
         temperature = temperature.replace("{%img1%}","https://www.freeiconspng.com/uploads/cloud-rain-icon-2.png");
         
      }
      else{
         temperature = temperature.replace("{%img1%}","https://img.icons8.com/emoji/96/000000/sun-emoji.png");
      }
     
    // if(tem_status == "Rain") {
    //    temperature = document.getElementById("image").src="https://www.freeiconspng.com/uploads/cloud-rain-icon-2.png";
    // }
    temperature = temperature.replace("{%temp_max%}",temp_max.toFixed(2));
    temperature = temperature.replace("{%tem_min%}",temp_min.toFixed(2));

    temperature = temperature.replace("{%cloud%}",orgVal.weather[0].main);
    temperature = temperature.replace("{%cloud_des%}",orgVal.weather[0].description);
    temperature = temperature.replace("{%humidity%}",orgVal.main.humidity);
    var sunrise_time = orgVal.sys.sunrise;
    var date = new Date(sunrise_time * 1000);
    var temperature1 = date.toLocaleTimeString();
    temperature = temperature.replace("{%sunrise%}",temperature1);

    var sunset_time = orgVal.sys.sunset;
    var date1 = new Date(sunset_time * 1000);
    temperature2 = date1.toLocaleTimeString();
    temperature = temperature.replace("{%sunset%}",temperature2 );
    //console.log(tempe);
    return temperature;
} 

const server = http.createServer((req,res) => {
    if(req.url == "/"){
            requests("https://api.openweathermap.org/data/2.5/weather?q=bangalore&appid=9a9e8a7fe55d06de7ef2ac31a40d38a7")
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                console.log(arrData[0].name) ;
                const realTimeData = arrData.map((val) => replacePune(homFile,val)).join();
                //const realTimeData1 = arrData.map((val) => replaceBang(homFile,val)).join();
                res.write(realTimeData);
                })
            
                .on("end", (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                console.log('end');
                });
            
    }
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
