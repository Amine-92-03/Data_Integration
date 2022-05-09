const fs= require('fs')
const path=require('path')
const dbConfig = require('./utils/dbConnexion')
const shell = require('shelljs')
var {insertIntoTable,getlistFichiers,insertHistoTable,getTotalInitLines} = require('./models')
// const dirPath = path.join(__dirname,'dataExcel')
const dirPath = path.join('Z:\Exploitation')
// const dirPath=path.join(__dirname,'dataExcel_P1')
// const dirPath=path.join(__dirname,'dataExcel_P2')
// const dirPath=path.join(__dirname,'dataExcel_P3')
// const dirPath=path.join(__dirname,'dataExcel_P4')
// const dirPath=path.join(__dirname,'dataExcel_P5')
// const dirPath=path.join(__dirname,'dataExcel_P6')
// const dirPath = '\\\\devr-qls-pr-01\DATA\Exploitation'
var sql = require('mssql')
var listOsFiles = fs.readdirSync(dirPath)
var progressBarOptions = require('./utils/progressBarOptions')
var cliProgress = require('cli-progress')
var  xlsx= require("xlsx")
var progressBarOptions = require('./utils/progressBarOptions')
var cliProgress = require('cli-progress')

console.log('**************** app.js : data integration ******************');

async function getListeFichiersBDD(){
    let T_sql = getlistFichiers()
    try{
        let pool = await sql.connect(dbConfig)
        let listFilesStored = pool.request().query(T_sql)
        return listFilesStored
    }catch(err){
        console.log('error app.js => getListeFichiersBDD() !');
    }
}

getListeFichiersBDD().then(res=>{
    let listFilesStore = [];
    let listFilesToIntegrate = [];
    nbrRows = res.rowsAffected[0]
    for (let i = 0; i < nbrRows; i++) {
        listFilesStore.push(res.recordset[i].Nom_du_fichier)   
    }
    let i = 0
    listOsFiles.forEach(file=>{
        if (listFilesStore.length == 0 || !(listFilesStore.includes(file))){
                listFilesToIntegrate.push(file);
                i++
        }        
    })
    insertDataToBDD(listFilesToIntegrate)
})

async function insertDataToBDD( listeData){
    let pool = await sql.connect( dbConfig )
    let tSqlInitLines = getTotalInitLines()
    var totalInitLines = await pool.request().query(tSqlInitLines)
    var totalLines = 0 
    let counterFile = 0
    listeData.forEach( elm => {
        let data = importExcelData( elm , dirPath)
        console.log('Nom fichier :',elm,'| Nombre de lignes : ', data.length, '| etape : ', counterFile + 1);
        counterFile++
        let tSqlInsert = insertHistoTable(elm , data.length)
        pool.request().query(tSqlInsert)
        totalLines += data.length
        let statFile = statFichier( dirPath ,  elm)
        let index = 0
        data.forEach(elmt => {
            elmt.__EMPTY_6 = elmt.__EMPTY_6.toString()
            const Tsql = insertIntoTable( elmt , index + 1 , statFile )   
            index ++       
            pool.request().query(Tsql)
        })        
    });
    totalInitLines = totalInitLines.recordset[0].Nombre_de_lignes   
    console.log('Nombre total des lignes inserées : ',totalLines)
    console.log('Nombre initial des lignes BDD ACF61 : ',totalInitLines)
    console.log('Nombre final des lignes BDD ACF61 : ',totalInitLines + totalLines)
}

function importExcelData(nameOfFile, direrctoryfile){
    let wb = xlsx.readFile(direrctoryfile+'/'+nameOfFile,{cellDates:true})  
    let nomsPages = wb.SheetNames
    ws = wb.Sheets[nomsPages[0]]
    let data = xlsx.utils.sheet_to_json(ws)
    data = data.splice(2,data.length)
    return data
}

function statFichier(dir,nomFichier){
    let stat = fs.statSync( dir + '/' + nomFichier)
    stat.NomeFichier = nomFichier
    return stat
}




//************************************Brouillon******************************//


// async function progressBar(totalLines, totalInitLines){
    //     let pool = await sql.connect( dbConfig )
    //     let tSqlInitLines = getTotalInitLines()
    //     const bar1 = new cliProgress.SingleBar(progressBarOptions.opt('fileName'), cliProgress.Presets.rect)
    //     cron.schedule('* * * * * *', async function(){
    //         // console.log(totalInitLines);
    //         // bar1.start(totalLines + totalInitLines, 0);
    //         let totalInitLines_temp = await pool.request().query(tSqlInitLines)
    //         totalInitLines_temp = totalInitLines_temp.recordset[0].Nombre_de_lignes
    //         console.log(totalInitLines_temp);
    //         // bar1.update(totalInitLines_temp)
    //     })
    //     bar1.stop();
    // }


// async function jaugeBdd(){
//     let T_sql = getlistFichiers()
//     let pool = await sql.connect(dbConfig)
//         let nFileStored_t = pool.request().query(T_sql)
//         nFileStored_t.then( x => console.log(x.rowsAffected[0]))
// }

// async function insertAllDataLine( fileName , dirPath ){
//     var data = importExcelData( fileName , dirPath)
//     // console.log(data[0].__EMPTY);
//     // return
//     let nbrLine = data.length
//     const statFile = statFichier(dirPath,fileName)
//     // const bar1 = new cliProgress.SingleBar(progressBarOptions.opt(fileName), cliProgress.Presets.rect);
//     // bar1.start(nbrLine, 0);
//     // let res = true
//     // let i = 0
//     // while(res){
//     //     setDataToMssql(data[i],i+1,dirPath,fileName)
//     // }
//     let pool = await sql.connect(dbConfig)
//     let listFilesStored = pool.request().query(T_sql)

//     const bar1 = new cliProgress.SingleBar(progressBarOptions.opt('fileName'), cliProgress.Presets.rect);
//     bar1.start(nbrFiles, 0);
//     let nbrFiles=listFiles.length
//     for(let i = 0;i < nbrFiles;i++){
//             // insertAllDataLine(listFiles[i],dirPath)
//             try{
//                 for (let i = 0; i < nbrLine; i++) {
//                         const Tsql = insertIntoTable(data[i],i+1,statFile)
//                         // console.log(Tsql);
//                         // return
//                         pool.request().query(Tsql)
//                         // setDataToMssql(data[i],i+1,dirPath,fileName)
//                         // bar1.update(i+1)
//                 }
//                 }catch(err){
//                     console.log('error insert !',err);
//                 }
//             bar1.update(i+1)
//     }
//     bar1.stop();
// }

// // async function checkIfExist(newFileName,getlistFichiers){
// //     // console.log(getlistFichiers.includes(newFileName));
// //     if (getlistFichiers.length == 0){
// //         return false
// //     }
// //     else{
// //         return getlistFichiers.includes(newFileName);
// //     }   
// // }

// // console.log(importExcelData(listFiles[0],dirPath));
// // console.log(getlistFichiers());

// // function 




// async function setDataToMssql(data,index,dir,nomFichier){
//     const statFile = statFichier(dir,nomFichier)
//     const Tsql = insertIntoTable(data,index,statFile)
//     try{
//         let pool = await sql.connect(dbConfig)
//         pool.request().query(Tsql)

//         // pool.connect(function (err){
//         //     if(err){
//         //         console.log('connexion=> KO with mssql sever : '+ err)
//         //     }else{
//         //         return true
//         //     }
//         // })
//     }catch(err){
//         console.log('error insert !',err);
//     }
// }





