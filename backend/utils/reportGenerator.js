// backend/utils/reportGenerator.js
const PDFKit = require('pdfkit');
const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');

const generatePDF = async (data) => {
  const doc = new PDFKit();
  const filename = `report-${Date.now()}.pdf`;
  const filepath = path.join(__dirname, '..', 'reports', filename);
  
  // Ensure reports directory exists
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  
  doc.pipe(require('fs').createWriteStream(filepath));
  
  doc.fontSize(20).text('Pharmacy Report', 100, 100);
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, 100, 130);
  doc.text(`Total Revenue: $${data.revenue}`, 100, 150);
  doc.text(`Top Selling Medicine: ${data.topSelling}`, 100, 170);
  doc.text(`Approval Ratio: ${(data.approvalRatio * 100).toFixed(1)}%`, 100, 190);
  
  doc.end();
  return filepath;
};

const generateExcel = async (data) => {
  const workbook = XLSX.utils.book_new();
  
  // Summary sheet
  const summaryData = [
    ['Metric', 'Value'],
    ['Total Revenue', `$${data.revenue}`],
    ['Top Selling Medicine', data.topSelling],
    ['Units Sold (Top)', data.topSellingSold],
    ['Approval Ratio', `${(data.approvalRatio * 100).toFixed(1)}%`],
    ['Total Orders', data.totalOrders],
    ['Paid Orders', data.paidOrders]
  ];
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Stock levels sheet
  if (data.stockLevels && data.stockLevels.length > 0) {
    const stockData = [['Medicine', 'Stock', 'Price']];
    data.stockLevels.forEach(item => {
      stockData.push([item.name, item.stock, `$${item.price}`]);
    });
    const stockSheet = XLSX.utils.aoa_to_sheet(stockData);
    XLSX.utils.book_append_sheet(workbook, stockSheet, 'Stock Levels');
  }
  
  const filename = `report-${Date.now()}.xlsx`;
  const filepath = path.join(__dirname, '..', 'reports', filename);
  
  // Ensure reports directory exists
  await fs.mkdir(path.dirname(filepath), { recursive: true });
  
  XLSX.writeFile(workbook, filepath);
  return filepath;
};

module.exports = {
  generatePDF,
  generateExcel
};