const express = require('express');
const app = express();
const { connectDB, executeQuery } = require('./config/db');
const apnaSchoolApi = require('./MicroServices/ApnaSchool/apnaSchool');
app.use(express.urlencoded({ extended: false }));
connectDB();
app.set('trust proxy', 1);
app.use('/api/apna_school', apnaSchoolApi);
app.get('/', async (req, res) => {
    let sql = `INSERT INTO Master_Staff_Notification (School_Id, Category_Id, Sent_By, Notice_Heading, Notice_Content, Send_Date) VALUES (1,
    31,
    1, N'অনলাইনে Google ইনপুট সরঞ্জামগুলি ব্যবহার করে দেখুন', N'Contects',
    1311441);`
    let output = await executeQuery(sql);
    console.log(output)
    res.send('Wroking...');
});


const server = app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${server.address().port}`));