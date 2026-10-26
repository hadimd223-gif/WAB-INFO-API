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
        const apiRes = await fetch(`https://api.freefireinfo.in/uid?uid=${uid}`);
        const data = await apiRes.json();
        const nickname = data.nickname || data.name;

        if (nickname) {
            return res.json({
                nickname: nickname,
                region_code: region,
                region_name: "Bangladesh"
            });
        }

        // ব্যাকআপ সোর্স
        const res2 = await fetch(`https://bhauxinfo2.vercel.app/bhau?uid=${uid}&region=${region}`);
        const data2 = await res2.json();
        const nickname2 = data2.nickname || (data2.basicInfo && data2.basicInfo.nickname);

        if (nickname2) {
            return res.json({
                nickname: nickname2,
                region_code: region,
                region_name: "Bangladesh"
            });
        }

        return res.status(404).json({ error: "ID NOT FOUND IN SUPPORTED REGIONS" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
