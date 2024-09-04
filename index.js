const express = require ('express');
const axios = require ('axios');
const cheerio = require ('cheerio');
const bodyParser = require ('body-parser');
const cors = require('cors');


const PORT = process.env.PORT || 3000;

// use express
const app = express();


// including cors
const corsOptions ={
    origin: "http://localhost:3000/",
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


// including bodyParser
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

const url = "https://dailypost.ng"



 app.get("/", (req, res) => {

// url get request by axios
    axios(url, {

        // this sets the timeout to 10s
        timeout: 10000
    }).then((response => {
        const htmlPage = response.data;

        // loading html page to cheerio
        const $ = cheerio.load(htmlPage);

        const headlines = []

         $('.mvp-widget-feat1-cont a' , htmlPage).each(function() {

            const headlineUrl = $(this).attr('href');

             const headlineTitle = $(this).find('h2').text();
             const headlineImg = $(this).find("img.mvp-reg-img").attr("src");
             const headlineTime = $(this).find('div.mvp-cat-date-wrap span.mvp-cd-date').text()
             headlines.push({
                title: headlineTitle,
                imgUrl: headlineImg,
                time: headlineTime,
                url: headlineUrl
             })
         });

         if(headlines){
            res.json(headlines)
         }else{
            console.log('no news')
         }
      
    })
    ).catch(err => {
        console.log(err)
        res.send(err)
    })
 });


       //  Post Request


 app.post("/", (req, res) => {

    const postUrl = req.body.url

    axios(postUrl, {
        // this sets the timeout to 10s
        timeout: 10000
    }).then((response => {
        const htmlPage = response.data;

        // loading html page to cheerio
        const $ = cheerio.load(htmlPage)


       const headlineTitle =  $('h1.mvp-post-title').text();
       const headlineImg =  $('img.wp-post-image').attr('src');
       const headlineContent = []

    //    pushing each paragraph to headlineContent
       $('#mvp-content-main p').each( function(){
        const content = $(this).text()
        headlineContent.push(content)
    }
       );

    //    all data to be sent put togehther as data
       const data = {
        title: headlineTitle,
        content: headlineContent,
        headlineImg: headlineImg
       }
       res.json(data)
    }
    ));

   //  https://news-scrapper-server.onrender.com/

 })

app.listen(PORT, () => {console.log("listening successful to port 3000")})
