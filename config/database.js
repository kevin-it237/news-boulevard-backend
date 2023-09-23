const localDB = "mongodb://localhost/newsboulevard";
const liveDB = "mongodb+srv://newsboulevard:yBOOzFXLBP39B0ni@cluster0.tvrqc.mongodb.net/newsboulevard?retryWrites=true&w=majority"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}