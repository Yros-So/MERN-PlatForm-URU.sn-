const app = require('./app');
const local = './config/Database';

//database 
const connectDB = require(local);
const dotenv = require('dotenv');

// UnCaught Exeptions
process.on('uncaughtException', err => {
    console.log('ERROR: '+err.stack);
    console.log('La fermeture du Serveur est due a un UnCaught Exeeptions !"@Yros_SO"');
    process.exit(1);
})

//Setting up config file
dotenv.config({ path: 'backend/config/config.env' });

//Connect DataBase 
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log('A '+Date(Date.now())+' Le Server Ecoute sur le Port : '+process.env.PORT+' in '+process.env.NODE_ENV+' mode. "@Yros_SO"');
});

// Handle and UnHandle
process.on('unhandledRejection', err  => {
    console.log('ERROR: '+err.stack);
    console.log('La fermeture du server est du A la Base de donnees (config/config.env) !"@Yros_SO"');
    server.close(() => {
        process.exit(1);
    })
})
