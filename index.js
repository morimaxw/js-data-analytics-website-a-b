const fs = require("fs/promises");
const { tidy, groupBy, arrange, desc, asc } = require("@tidyjs/tidy");

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

  for (let i = 1; i < rowArray.length; i++) {
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
  console.log(data[0]);

  // now clean the data with tidy.js
  const sorted = tidy(data, arrange(desc('user_id')));
  console.log(sorted[0]);
}

main();