const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', async (req, res) => {
    const uid = req.query.uid;
    const region = req.query.region || 'BD';

    if (!uid) {
        return res.status(400).json({ error: "UID parameter is required" });
    }

    try {
        const response = await fetch('https://shop2game.com/api/auth/player_id_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://shop2game.com',
                'Referer': 'https://shop2game.com/app/100067/idlogin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({
                app_id: 100067,
                login_id: uid,
                app_server_id: 0
            })
        });

        const data = await response.json();
        
        if (data && data.nickname) {
            return res.json({
                nickname: data.nickname,
                region_code: region,
                region_name: "Bangladesh"
            });
        } else {
            return res.status(404).json({ error: "ID NOT FOUND" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
