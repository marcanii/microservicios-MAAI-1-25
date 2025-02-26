const fs=require('fs');

fs.readFile('MiArchivo.txt','utf8',(err,data)=>{
    if(err) throw err;
    console.log(data);
});