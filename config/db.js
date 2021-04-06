
const sql = require('mssql');
let pool;
async function connectDB() {
    try {
        pool = await sql.connect({
            user: 'AdityaSharma',
            password: 'SchoolSoft@321',
            server: '103.224.247.81',
            database: 'ApnaSchool',
        });
    }
    catch (err) {
        console.log('Error on Connecting...', err.message);
    }
}

async function executeQuery(sql) {
    try {
        let result = await pool.query(sql);
        console.log('executed')
        return result.recordset;
    }
    catch (err) {
        return { err: err.message };
    }
}

module.exports = { connectDB, executeQuery };