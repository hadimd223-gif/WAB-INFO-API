const express = require('express');
const app = express();

// CORS হেডার এলাও করা যেন কোনো ব্লক না করে
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/check', async (req, res) => {
    const uid = req.query.uid;
    if (!uid) {
        return res.status(400).json({ success: false, error: 'UID is required' });
    }

    try {
        // সরাসরি ওয়ার্কিং পাবলিক ফ্রি ফায়ার গেমিং এপিআই সোর্স
        const response = await fetch(`https://api.freefireinfo.in/uid?uid=${uid}`);
        const data = await response.json();

        let nickname = data.nickname || data.name;

        if (nickname) {
            return res.json({
                success: true,
                uid: uid,
                nickname: nickname
            });
        } else {
            // সেকেন্ডারি ব্যাকআপ সোর্স
            const response2 = await fetch(`https://bhauxinfo2.vercel.app/bhau?uid=${uid}&region=BD`);
            const data2 = await response2.json();
            let nickname2 = data2.nickname || (data2.basicInfo && data2.basicInfo.nickname);
            
            if (nickname2) {
                return res.json({ success: true, uid: uid, nickname: nickname2 });
            }

            return res.status(404).json({ success: false, error: 'Player not found' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to fetch player info' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
