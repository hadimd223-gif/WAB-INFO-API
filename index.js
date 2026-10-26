const express = require('express');
const app = express();

app.get('/api/check', async (req, res) => {
    const uid = req.query.uid;
    const region = req.query.region || 'BD';

    if (!uid) {
        return res.status(400).json({ error: 'UID is required' });
    }

    try {
        // গেরিনা বা ফ্রি ফায়ার রিজিয়ন বেসড ডেটা ফেচ করার রিকোয়েস্ট
        const response = await fetch(`https://client.freefiremobile.com/get_player_info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid: uid, region: region })
        });
        
        // নোট: গেরিনার রিকুয়েস্ট প্রোটোকল প্রোপারলি হ্যান্ডেল করতে ব্যাকএন্ডে এনক্রিপ্টেড পেলেলোড বা থার্ড পার্টি রিলায়েবল মেথড লাগে। 
        // সহজ সমাধানের জন্য নিচের প্রিমেইড ফ্রি ফায়ার আনঅফিসিয়াল পবলিক সোর্স লজিক ব্যবহার করতে পারেন:
        
        const apiRes = await fetch(`https://api.freefireinfo.in/uid?uid=${uid}`);
        const data = await apiRes.json();

        res.json({
            success: true,
            uid: uid,
            nickname: data.nickname || data.name || "Unknown User"
        });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch player info' });
    }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
