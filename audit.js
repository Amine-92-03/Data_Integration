const dbConfig = require('./utils/dbConnexion')
var {getListStoredlines,getListHistolines,dataToDeleteBAS,tSqlDataIntegrationHisto} = require('./models')
var sql = require('mssql')
const shell = require('shelljs')

console.log('**************** audit.js : data quality control ********************')

async function ListesFichiersIntBDD(){
    let tSql = getListStoredlines()
    let tSqlHisto = getListHistolines()
    // console.log('tSql',tSql);
    // console.log('tSqlHisto',tSqlHisto);
    try{
        let pool = await sql.connect(dbConfig)
        let listFilesStored = await pool.request().query(tSql)
        let listHistoFile = await pool.request().query(tSqlHisto)
        return {listHistoFile, listFilesStored}
    }catch(err){
        console.log('error insert audit.js => ListesFichiersIntBDD() !');
        // console.log(err);
    }
}

ListesFichiersIntBDD().then(res=>{ 
    let filesToDelete = []
    let dataHistoFile = res.listHistoFile.recordset
    let dataStoredFile = res.listFilesStored.recordset
    dataHistoFile.forEach(elm =>{
        dataStoredFile.forEach(elmt =>{
            if(elm.Nom_du_fichier == elmt.Nom_du_fichier){
                if(elm.Nombre_de_lignes != elmt.Nombre_de_lignes){
                    filesToDelete.push(`'${elm.Nom_du_fichier}'`)
                }
            }
        })
    })
    if(filesToDelete.length !=0){
        deleteDataInBDD(filesToDelete)
        //test shell.exec
        
        // todo e-mail
    }
    console.log('Audit terminé avec succèss : Données de bonne qualité');
})

async function deleteDataInBDD(list){
    let tSqlBAS = dataToDeleteBAS(list)
    let tSqlDIH = tSqlDataIntegrationHisto(list)
    try{
        let pool = await sql.connect(dbConfig)
        pool.request().query(tSqlBAS)
        pool.request().query(tSqlDIH)
        console.log('Listes des fichiers supprimés :',list);
        shell.exec('node app.js')
    }catch(err){
        console.log('error insert !',err);
    }
}

