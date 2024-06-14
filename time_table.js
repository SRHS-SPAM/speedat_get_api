const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.get('/api/timeData/:grade/:name/:day', async (req, res) => {
    const grade = req.params.grade;
    const name = req.params.name;
    const day = req.params.day;

    const params = {
        KEY: '5c623bd698b545eab5ef559f9cbf04ac',
        Type: 'json',
        pIndex: 1,
        pSize: 100,
        ATPT_OFCDC_SC_CODE: 'B10',
        SD_SCHUL_CODE: '7010738',
        GRADE: grade,
        CLASS_NM: name,
        ALL_TI_YMD: day
    };

    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    const url = `https://open.neis.go.kr/hub/hisTimetable?${queryString}`;

    try {
        const response = await fetch(url);
        const jsonData = await response.json();

        // 응답 데이터를 로그로 출력하여 확인
        console.log('jsonData:', JSON.stringify(jsonData, null, 2));

        // hisTimetable 배열이 존재하고 데이터가 있는지 확인
        if (jsonData.hisTimetable && jsonData.hisTimetable.length > 1 && jsonData.hisTimetable[1].row) {
            const rows = jsonData.hisTimetable[1].row;

            // 모든 과목명을 배열에 수집
            const subjects = rows.map(row => row.ITRT_CNTNT);

            res.send({ subjects });
        } else {
            res.status(404).send({ error: 'No timetable data found for the given parameters' });
        }
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching timetable data' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});