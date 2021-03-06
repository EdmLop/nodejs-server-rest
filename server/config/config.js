/*=================================
Puerto
=================================
*/

process.env.PORT = process.env.PORT || 3000;

/*=================================
Entorno
=================================
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/*=================================
Sesion
=================================
*/
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/*=================================
Semilla
=================================
*/
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarro';

/*=================================
DB
=================================
*/
let urldb;

if (process.env.NODE_ENV === 'dev') {
    urldb = 'mongodb://localhost:27017/cafe';
} else {
    urldb = process.env.MONGO_URI;
}

process.env.URLDB = urldb;

/*=================================
Google cliente id
=================================
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '735272216208-tab77bnfasv974bfhntm3lg0k68eq33d.apps.googleusercontent.com';