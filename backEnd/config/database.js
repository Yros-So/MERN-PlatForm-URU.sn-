const mongoose = require("mongoose");

// const connectDatabase = async () => {
//     mongoose.connect('mongodb://127.0.0.1:27017/dimma', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true
//     }).then(con =>{
//         console.log('MongoDB Database connected with HOST : '+con.connection.host)
//     })
// }

// module.exports = connectDatabase;
//const uri = 'mongodb://127.0.0.1:27017/myapp';


const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;