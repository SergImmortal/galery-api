import express from "express";
import session from 'express-session';
import {config} from './lib/config';
import router from './routes/router';

const port: number = config.appPort;
const app = express();

// Set up mongoose(ODM) connection
// let options: any = {
//     dbName: config.db.name,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     auth: {
//         user: config.db.user,
//         password: config.db.user
//     }
// };

// mongoose.connect(`mongodb://localhost:27017/admin`,options);
// mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// Server session
// var MongoStore = connectMongo(session);
// app.use(session({
//     secret: config.session.secret,
//     cookie:  {
//         "httpOnly": true,
//         "maxAge": null
//     },
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     resave: true,
//     saveUninitialized: true
// }));

router(app);

app.disable('x-powered-by');
// start the express server
app.listen( config.appPort, () => {
    console.log( `server started at http://localhost:${ port }` );
} );
