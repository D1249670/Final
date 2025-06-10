const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbPath = path.join(dbDir, 'sqlite.db');

// 確保 db 目錄存在
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// 檢查資料庫檔案是否存在
const dbExists = fs.existsSync(dbPath);

// 開啟資料庫
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
    } else {
        console.log('成功開啟資料庫');
        if (!dbExists) {
            console.log('資料庫不存在，已新建資料庫');
            // 建立 table 並插入資料
            db.serialize(() => {
                db.run(`CREATE TABLE IF NOT EXISTS prices (
                    year INTEGER,
                    price TEXT,
                    type TEXT,
                    PRIMARY KEY (year, type)
                )`);
                const stmt = db.prepare('INSERT OR REPLACE INTO prices (year, price, type) VALUES (?, ?, ?)');
                // 台灣價格
                const taiwanData = [
                    [2005, 'NT$65'], [2006, 'NT$66'], [2007, 'NT$67'], [2008, 'NT$68'], [2009, 'NT$69'],
                    [2010, 'NT$70'], [2011, 'NT$71'], [2012, 'NT$72'], [2013, 'NT$73'], [2014, 'NT$74'],
                    [2015, 'NT$75'], [2016, 'NT$76'], [2017, 'NT$77'], [2018, 'NT$78'], [2019, 'NT$72'],
                    [2020, 'NT$73'], [2021, 'NT$74'], [2022, 'NT$75'], [2023, 'NT$75'], [2024, 'NT$76'], [2025, 'NT$78']
                ];
                taiwanData.forEach(([year, price]) => {
                    stmt.run(year, price, 'taiwan');
                });
                // 全球價格
                const globalData = [
                    [2005, '83'], [2006, '88'], [2007, '96'], [2008, '96'], [2009, '94'],
                    [2010, '95'], [2011, '93'], [2012, '96'], [2013, '101'], [2014, '109'],
                    [2015, '128'], [2016, '139'], [2017, '139'], [2018, '146'], [2019, '158'],
                    [2020, '155'], [2021, '151'], [2022, '165'], [2023, '174'], [2024, '183'], [2025, '174（預估）']
                ];
                globalData.forEach(([year, price]) => {
                    stmt.run(year, price, 'global');
                });
                stmt.finalize();
                console.log('已建立 prices 資料表並插入資料');
            });
        }
    }
});

module.exports = db;
