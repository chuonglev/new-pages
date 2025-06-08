const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect(
    'mongodb+srv://phandatnhan2811:LdapuUFX7YrzEq9l@cluster1-phannhan.1lsmjgb.mongodb.net/contactFormDB?retryWrites=true&w=majority&appName=Cluster1-phannhan',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// Định nghĩa schema phù hợp với contact.page.html (không có subject)
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    time: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

app.use(cors());
app.use(bodyParser.json());

// API nhận dữ liệu liên hệ
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
        }
        const contact = new Contact({ name, email, message });
        await contact.save();
        res.status(200).json({ message: 'Liên hệ đã được lưu thành công!' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lưu liên hệ.' });
    }
});

// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Điều hướng root về trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.page.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});