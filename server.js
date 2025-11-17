const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Status } = require('whatsapp-web.js');

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

//Storage Image
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('File harus gambar ya sob!'));
        }
        cb(null, true);
    }
});

//Endpoint Upload image
app.post('/upload-image', uploadImage.single('image'), (req, res) => {
    res.json({
        status: "Success",
        file: req.file.filename,
        path: `/uploads/images/${req.file.filename}`
    });
});

//Storage Upload CSV
const csvstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/csv');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploadCSV = multer({
    storage: csvstorage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.endsWith('.csv')){
            return cb(new Error('File harus format CSV ya sob!'));
        }
        cb(null, true);
    }
});

//Endpoint Upload CSV
app.post('/upload-csv', uploadCSV.single('csv'), (req, res) => {
    res.json({
        status: "Success",
        file: req.file.filename,
        path: `/uploads/csv/${req.file.filename}`
    });
});

});