const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());

// Basit geçici kullanıcı veritabanı
const users = {}; 

// Ana sayfada index.html dosyasını gönder
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Kayıt Olma API'si
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.json({ success: false, message: "Bu kullanıcı adı zaten alınmış!" });
    }
    users[username] = password;
    res.json({ success: true, message: "Kayıt başarılı!" });
});

// Giriş Yapma API'si
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        return res.json({ success: true, message: "Giriş başarılı!" });
    }
    res.json({ success: false, message: "Kullanıcı adı veya şifre hatalı!" });
});

// Soket Bağlantıları
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// RENDER İÇİN KRİTİK PORT AYARI (Hatanın sebebi buydu)
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı!`);
});
