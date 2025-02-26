const fs=require('fs');

async function leerArchivo(){
  try{
    const data=await fs.promises.readFile('MiArchivo.txt','utf8');
    console.log(data)
  } 
    catch(err){
        console.error(err);
    }
}
leerArchivo();