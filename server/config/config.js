module.exports = {
    server: {
        host: '0.0.0.0',
        port: 9000
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        db: 'sowil-dev',
        username: '',
        password: ''
    },
    key: {
        privateKey: '37LvDNugXvjYOh9Y'
        // tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    email: {
        username: "sampleapp1891@gmail.com",
        password: "Papaisgreat1@",
        accountName: "PeeyushGmail",
        verifyEmailUrl: "verifyEmail"
    },
    logs: {
        filename: "logs/sowil"
    },
    strings: {
        "INFO": "info",
        "ERROR": "error"
    }
};