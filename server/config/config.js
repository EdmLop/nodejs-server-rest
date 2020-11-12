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
DB
=================================
*/
let urldb;

if (process.env.NODE_ENV === 'dev') {
    urldb = 'mongodb://localhost:27017/cafe';
} else {
    urldb = 'mongodb+srv://edmundolopez:w5sDhXprxmUAipuD@cluster0.fv69p.mongodb.net/cafe';
}

process.env.URLDB = urldb;