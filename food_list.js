const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/api/mealData/:meal/:date', async (req, res) => {
    const date = req.params.date;
    const meal = req.params.meal;
    console.log(req)
    const params = {
        KEY: '5c623bd698b545eab5ef559f9cbf04ac',
        Type: 'json',
        pIndex: 1,
        pSize: 100,
        ATPT_OFCDC_SC_CODE: 'B10',
        SD_SCHUL_CODE: '7010738',
        MMEAL_SC_CODE: meal,
        MLSV_YMD: date
    };

    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const url = `https://open.neis.go.kr/hub/mealServiceDietInfo?${queryString}`;

    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        // 응답 데이터를 로그로 출력하여 확인
        // mealServiceDietInfo 배열이 존재하고 데이터가 있는지 확인
        if (jsonData.mealServiceDietInfo && jsonData.mealServiceDietInfo.length > 1 && jsonData.mealServiceDietInfo[1].row) {
            const row = jsonData.mealServiceDietInfo[1].row[0];
            console.log(row)

            const dowonLove = {
                mealType: row.MMEAL_SC_NM,
                menu: row.DDISH_NM
            };
            res.send(dowonLove.menu.split("<br/>"));






        } else {
            res.status(404).send({ error: 'No meal data found for the given date and meal type' });
        }
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching meal data' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});