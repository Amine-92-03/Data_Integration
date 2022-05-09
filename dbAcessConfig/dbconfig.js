var dbConfig ={
    server: 'xxxxxxxx',
    database:'xxxxxxxx',
    user:'xxxxxxxxxxx',
    password:'xxxxxxxxxxxxx',
    port:1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        },
        encrypt: true,
        trustServerCertificate: true
    }
}
module.exports= dbConfig;