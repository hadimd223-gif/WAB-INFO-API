const express = require('express');
const app = express();

app.get('/api/check', async (req, res) => {
    const uid = req.query.uid;
    if (!uid) {
        return res.status(400).json({ success: false, error: 'UID is required' });
    }

    try {
        // রিলায়েবল ফ্রি ফায়ার ইনফো এপিআই সোর্স
        const response = await fetch(`https://bhauxinfo2.vercel.app/bhau?uid=${uid}&region=BD`);
        const data = await response.json();

        let nickname = data.nickname || (data.basicInfo && data.basicInfo.nickname);

        if (nickname) {
            return res.json({
                success: true,
                uid: uid,
                nickname: nickname
            });
        } else {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch player info' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
