const admin = require("firebase-admin");

if(admin.apps.length === 0){
    admin.initializeApp({
        credential: admin.credential.cert(require("./serviceAccountKey.json"))
    });
}

module.exports = admin;