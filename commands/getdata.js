module.exports = {
    name: 'getdata',
    description: 'Getting data from the DB',
    
    execute(message, db, query, userid, uname){
        if (!message.mentions.users.size) {
            getdata(db, query, userid, uname);
        } else{
            const taggedUser = message.mentions.users.first();
            userid = taggedUser.id;
            uname = taggedUser.username;
            getdata(db, query, userid, uname);
        }
    }
}

function getdata(db, query, userid, uname){
    db.get(query, [userid], (err, row) => {

        if (err) {
            console.log(err);
            return;
        }
        if (row === undefined) {
            let insertdata = db.prepare(`INSERT INTO data VALUES(?,?,?)`);
            insertdata.run(userid, uname, 0);
            insertdata.finalize();
            db.close();
            return;
        } else {
            let count = row.total;
            console.log(`${userid} - ${uname} - ${count}`);
        }   
    });
}