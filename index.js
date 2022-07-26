const fs = require("fs/promises");
const { tidy, groupBy, arrange, desc, asc, distinct, select, replaceNully, filter, summarize, sum, mean, median } = require("@tidyjs/tidy");

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
  console.log(data.length);

  // now clean the data with tidy.js
  const cleaned = tidy(
    data, 
    select(['user_id', 'group', 'landing_page', 'converted']),
    replaceNully({ group: 'control', 'landing_page': 'old_page', 'converted': 0}),
    arrange(desc('user_id')),
    distinct(['user_id']),
    filter((d) => !(d.user_id === undefined || d.user_id === null || d.user_id === '')),
  );

  console.log(cleaned.length);
  console.log(cleaned[0]);

  // now calculate some aggregate statistics to get an idea about the data
  const summary = tidy(
    cleaned,
    summarize({
      observationCount: (items) => items.length,
      convertedAmount: sum('converted'),
      percentageConverted: mean((item) => parseInt(item.converted)),
    }),
  );

  console.log(summary);

  const averageOld = tidy(
    cleaned,
    filter((item) => item.group === 'control'),
    summarize({
      observationCount: (items) => items.length,
      convertedAmount: sum('converted'),
      percentageConverted: mean((item) => parseInt(item.converted)),
    }),
  );

  console.log(averageOld);

  const averageNew = tidy(
    cleaned,
    filter((item) => item.group === 'treatment'),
    summarize({
      observationCount: (items) => items.length,
      convertedAmount: sum('converted'),
      percentageConverted: mean((item) => parseInt(item.converted)),
    }),
  );

  console.log(averageNew);

}

main();