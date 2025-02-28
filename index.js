import express from 'express';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs'
const app = express();

const PORT = process.env.PORT || 1000


app.use(express.urlencoded())

app.get("/", (req, res)=>{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    res.sendFile(__dirname + "//index.html")
})

app.post("/longToShortURL", express.json(),(req,res)=>{
    
    const shortURL = nanoid(8);
    const urlFileData = fs.readFileSync("url-data.json",(err)=>{if(err) console.log(err)})
    const urlFileObj = JSON.parse(urlFileData);
    const longURL = req.body.longURL;
    urlFileObj[shortURL] = longURL,
    fs.writeFileSync("url-data.json",JSON.stringify(urlFileObj))

    res.json({
        success: true,
        URL: `https://url-shortener-xrl3.onrender.com/${shortURL}`
    })
})

app.get("/:shorturl", (req,res)=>{
    const fileObj = JSON.parse(fs.readFileSync("url-data.json").toString());
    console.log(`${req.params.shorturl} ka long url ye ${fileObj[req.params.shorturl]} hai`);
    
    res.redirect(fileObj[req.params.shorturl]);
})

app.listen(PORT, ()=> console.log(`Server is up and on Port ${PORT}`));