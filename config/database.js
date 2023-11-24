const localDB = "mongodb://localhost/newsboulevard";
const liveDB = "mongodb+srv://newsboulevard:NTvMTujbOiba1Daj@cluster0.mej874v.mongodb.net/newsboulevard?retryWrites=true&w=majority"

module.exports = {
    database: process.env.NODE_ENV !== 'production' ? localDB : liveDB
}