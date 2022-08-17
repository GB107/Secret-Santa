
var db = mongoose.connection;
db.on('error',console.log("connection data failed"));
db.on('open',console.log("connected to data"));