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
        const response = await fetch(`https://bhauxinfo2.vercel.app/bhau?uid=${uid}&region=${region}`);
        const data = await response.json();
        
        let nickname = data.nickname || (data.basicInfo && data.basicInfo.nickname);

        if (nickname) {
            return res.json({
                nickname: nickname,
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
