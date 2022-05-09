const cron = require('node-cron')
const shell = require('shelljs')

cron.schedule('* 07 09 * * *', async function (){
    console.log('**************** CRON-NODE **********')
    shell.exec('cls')  
    shell.exec('node app.js')
    shell.exec('node audit.js')
})

cron.schedule('* 05 10 * * *', async function (){
    console.log('**************** CRON-NODE **********')
    shell.exec('node app.js')
    shell.exec('node audit.js')
})


