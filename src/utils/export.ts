export const exportToExcel = async (params: {
  data: any[];
  fileName?: string;
  colInfo?: { name: string; width: number }[];
}) => {
  const { data, fileName, colInfo } = params;
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.addRow(colInfo?.map((item) => item.name));
  if (colInfo && colInfo.length > 0) {
    colInfo.map((item, index) => {
      worksheet.getColumn(index + 1).width = item.width;
    });
    const rows = data.map((item) => Object.values(item));
    worksheet.addRows(rows);
  }
  worksheet.eachRow((item: any, rowNumber: number) => {
    item.height = 20;
    item.font = rowNumber === 1 ? { size: 16, bold: true } : { size: 16 };
    item.alignment = { horizontal: 'center' };
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'output.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
};

import Excel from 'exceljs';
