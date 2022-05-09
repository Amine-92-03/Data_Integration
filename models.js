const insertIntoTable=(data,index,statFile)=>{
    let sql=`INSERT INTO BacASableRapportProdAsten( 
        ID_fichier,
        Flag_Fichier,
        ID_jour,
        Index_line,
        Domaine,
        Serveur,
        Tache,
        MU,
        Unite_de_gestion,
        Session1,
        Session2,
        Job,
        Uproc,
        Statut,
        Prevu,
        Debut,
        Fin,
        Duree,
        Temps_estime,
        Fil_rouge,
        Info,
        Date_creation_fichier,
        Date_derniere_modification,
        Nom_du_fichier,
        Nombre_de_lignes,
        Taille_du_fichier,
        Auteur_du_fichier
        )
        Values(
         ${IDfichier(statFile.NomeFichier)},
         2,
         ${IDJour(statFile.NomeFichier)},
         ${index},
        '${verifiernull(data.__EMPTY.split(`'`))}',
        '${verifiernull(data.__EMPTY_1.split(`'`))}',
        '${verifiernull(data.__EMPTY_2.split(`'`))}',
        '${verifiernull(data.__EMPTY_3.split(`'`))}',
        '${verifiernull(data.__EMPTY_4.split(`'`))}',
        '${verifiernull(data.__EMPTY_5.split(`'`))}',
        '${verifiernull(data.__EMPTY_6.split(`'`))}',
        '${verifiernull(data.__EMPTY_7.split(`'`))}',
        '${verifiernull(data.__EMPTY_8.split(`'`))}',
        '${verifiernull(data.__EMPTY_9.split(`'`))}',
        '${verifiernull(data.__EMPTY_10)}',
        '${verifiernull(data.__EMPTY_11)}',
        '${verifiernull(data.__EMPTY_12)}',
        '${verifiernull(data.__EMPTY_13)}',
        '${verifiernull(data.__EMPTY_14)}',
         ${verifiernullInt(data.__EMPTY_15)},
        '${verifiernull(data.__EMPTY_16)}',
        '${verifiernull(statFile.birthtime)}',
        '${verifiernull(statFile.mtime)}',
        '${statFile.NomeFichier}',
        -99,
        ${statFile.size},
        'Erwann COZIC'
        )`
        // console.log(s
        return sql
}

const getlistFichiers = ()=>{
    let sqlListeFichiers=`SELECT DISTINCT Nom_du_fichier FROM BacASableRapportProdAsten`
        return sqlListeFichiers
    }

const insertHistoTable = (nomFichier, nombreLignes)=>{
    let tSqlInsertHisto=`INSERT INTO [dbo].[data_integration_Histo] 
                            (
                                [Nom_du_fichier],
                                [Nombre_de_lignes]
                            )
                                VALUES 
                            (
                                '${nomFichier}',
                                ${nombreLignes}
                            )`
        return tSqlInsertHisto
    }

const getListStoredlines = () => {
   let TSQL = `SELECT DISTINCT Nom_du_fichier, COUNT(Nom_du_fichier) Nombre_de_lignes 
                FROM BacASableRapportProdAsten
                GROUP BY Nom_du_fichier,Date_creation_fichier`
    return TSQL
}

const getListHistolines = () => {
    let TSQL = `SELECT Nom_du_fichier, Nombre_de_lignes FROM data_integration_Histo`
     return TSQL
 }

const dataToDeleteBAS = (List) => {
    let TSQL = `DELETE FROM BacASableRapportProdAsten
                WHERE Nom_du_fichier IN(${List})`
    return TSQL
}

const tSqlDataIntegrationHisto = (List) =>{
    let TSQL = `DELETE FROM data_integration_Histo
                WHERE Nom_du_fichier IN(${List})`
    return TSQL
}

const getTotalInitLines = () =>{
    let TSQL = `SELECT COUNT(Nom_du_fichier) Nombre_de_lignes FROM BacASableRapportProdAsten`
    return TSQL
}

function verifiernull(value){
    if(value == null || value=='' ){
        return 'void'
    } 
    return value
}
function verifiernullInt(value){
    if(value == null || value==''){
        return 0
    }
    return value
}

function convertToMsSqlDate(jsTime){
    if(jsTime==null||jsTime==''){
        return `01-01-2020 00:00:00`
    }
    let setTime=new Date(jsTime)
    let h=setTime.getHours()
    let m=setTime.getMinutes()
    let s=setTime.getSeconds()
    let M=setTime.getMonth()+1
    let y=setTime.getFullYear()
    let d=setTime.getDate()
    if(h<10){
        h='0'+h
    }
    if(m<10){
        m='0'+m
    }
    if(s<10){
        s='0'+s
    }
    if(d<10){
        d='0'+d
    }
    if(M<10){
        M='0'+M
    }
    return `${y}-${M}-${d} ${h}:${m}:${s}`
    }

function IDfichier(NomFichier){
    try{
        return parseInt(NomFichier.split('-')[2]+NomFichier.split('-')[3].split('.')[0]) 
    }catch(err){
        console.log('dbDataIntegration => dbSelector.js => function IDfichier(NomFichier)')
        //console.log(err);
    }
}

function IDJour(NomFichier){
    try{
        return parseInt(NomFichier.split('-')[2]) 
    }catch{
        console.log('dbDataIntegration => dbSelector.js => function IDJour(NomFichier)')
        //console.log(err);
    }
}

module.exports={insertIntoTable,
                getlistFichiers,
                insertHistoTable,
                getListStoredlines,
                getListHistolines,
                dataToDeleteBAS,
                tSqlDataIntegrationHisto,
                getTotalInitLines}




// const insertIntoTableListFichier=(NomFichier)=>{
//     let sqlListeFichiers=`INSERT INTO ListeFichiersProdAsten( 
//         Nom_du_fichier
//         )
//         VALUES
//         (
//         '${verifiernull(NomFichier)}'
//         )`
//         return sqlListeFichiers
//     }

    