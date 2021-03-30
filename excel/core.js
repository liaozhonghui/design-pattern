async function parseExcelAndImpotAssessee(buf) {
  let workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buf);
  const worksheet = workbook.worksheets[0];

  let collections = [];
  let keyMap = {
    '周期类型': 'period',
    '工号': 'empno',
    '姓名': 'name',
    '所属绩效团队': 'team',
    '所属部门': 'department',
    '所属子部门': 'group',
    '岗位': 'position',
    '职级': 'grade',
  };
  let keys = [];
  worksheet.eachRow(function (row, rowNumber) {
    if (rowNumber === 1) {
      row.values.forEach((key, i) => {
        keys[i] = keyMap[key];
      });
    } else {
      let obj = row.values.reduce((obj, v, i) => {
        obj[keys[i]] = v;
        return obj;
      }, {});
      collections.push(obj);
    }
  });
  console.log('collections.', collections);
  return collections;
}

function dealDataTransfer(input) {
  console.log('input:', input);

  return _.identity(input);
}
