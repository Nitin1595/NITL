const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

(async () => {
  try {
    const reportDir = path.join(process.cwd(), 'excel-report');
    const files = fs.readdirSync(reportDir)
      .filter(f => f.toLowerCase().endsWith('.xlsx'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.join(reportDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.error('No report files found in', reportDir);
      process.exit(1);
    }

    const latest = path.join(reportDir, files[0].name);
    console.log('Unhiding columns in', latest);

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(latest);

    const ws = wb.worksheets[0];
    const maxCol = Math.max(ws.columnCount, 6);
    for (let c = 6; c <= maxCol; c++) {
      try {
        ws.getColumn(c).hidden = false;
        // optionally reset width but keep existing
        // ws.getColumn(c).width = 10;
      } catch (e) {
        // ignore
      }
    }

    await wb.xlsx.writeFile(latest);
    console.log('Done. Unhidden columns from F onwards in', latest);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
