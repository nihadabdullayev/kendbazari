const fs = require('fs');
const path = require('path');

const dbJsonPath = path.join(__dirname, 'database.json');

function readDb() {
  if (!fs.existsSync(dbJsonPath)) {
    return { categories: [], products: [], producers: [], orders: [], adminUsers: [] };
  }
  const raw = fs.readFileSync(dbJsonPath, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(data) {
  fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
  readDb,
  writeDb
};
