const fs = require("fs/promises");

const labels = [
  "user_id",
  "timestamp",
  "group",
  "landing_page",
  "converted"
];

const readCSV = async (filePath, labels) => {
  const file = await fs.readFile(filePath);
  const rowArray = file.toString().split("\n");
  const result = [];

  for (let i = 0; i < rowArray.length; i++) {
    const cellsOfRow = rowArray[i].split(",");
    const obj = {};
    for (let j = 0; j < cellsOfRow.length; j++) {
      const cell = cellsOfRow[j];
      obj[labels[j]] = cell;
    }
    result.push(obj);
  }
  return result;
};

const main = async () => {
  const data = await readCSV(`data/data.csv`, labels);
  console.log(data[156]);

  // now clean the data with tidy.js
}

main();