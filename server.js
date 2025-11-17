const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('web'));

//TEST 1 - Cek server
app.get("/", (req, res) => {
    res.send("server berhasil dijalankan");
});

//Jalankan server
app.listen(3000, () => {
    console.log("Server berhasil running dilocal port 3000");
})