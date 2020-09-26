const sqlite = require('sqlite3').verbose();


module.exports = {
    name: 'total',
    description: 'Sum of all messages',
    execute(message){
        let totalx = 0;
        const dab = new sqlite.Database('./datos.db', sqlite.OPEN_READONLY);
        dab.all("SELECT total FROM data", function(err, rows) {
            if(err) {
                console.log("Error");
                return;
            }
            const randomList = [];
            rows.forEach(function (row) {
                randomList.push(row.total);
                totalx = totalx + row.total;
            })
            console.log(randomList);
            console.log(totalx);
        });
    }
}