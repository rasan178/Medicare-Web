const fs = require('fs');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');

exports.generatePDF = async (data) => {
  const doc = new PDFDocument();
  const path = `reports/report_${Date.now()}.pdf`;
  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(25).text('Sales Report');
  doc.text(`Revenue: $${data.revenue}`);
  doc.text(`Top Selling: ${data.topSelling}`);
  doc.text('Stock Levels:');
  data.stockLevels.forEach(level => doc.text(`${level.name}: ${level.stock}`));
  doc.text(`Approved/Declined Ratio: ${data.ratio}`);

  doc.end();
  return path;
};

exports.generateExcel = async (data) => {
  const wb = XLSX.utils.book_new();
  const ws_data = [
    ['Revenue', data.revenue],
    ['Top Selling', data.topSelling],
    ['Approved/Declined Ratio', data.ratio],
  ];
  data.stockLevels.forEach(level => ws_data.push([level.name, level.stock]));

  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  const path = `reports/report_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, path);
  return path;
}; 
