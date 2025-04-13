const fs = require("fs");
const path = require("path");

// Ensure the correct path, considering the script runs from the root
const filePath = path.resolve(__dirname, "../assets/translations/en.json");
// Read extracted JSON
const rawData = fs.readFileSync(filePath, "utf-8");
const flatMessages = JSON.parse(rawData);

// Function to convert flat keys into a nested object with string values
const nestKeys = (flatObj) => {
  const nestedObj = {};

  Object.keys(flatObj).forEach((key) => {
    const keys = key.split(".");
    let current = nestedObj;

    keys.forEach((part, index) => {
      if (!current[part]) {
        // If it's the last part, store the defaultMessage directly
        current[part] =
          index === keys.length - 1 ? flatObj[key].defaultMessage : {};
      }
      current = current[part];
    });
  });

  return nestedObj;
};

// Convert and save
const nestedMessages = nestKeys(flatMessages);
fs.writeFileSync(filePath, JSON.stringify(nestedMessages, null, 2));

console.log("✅ Transformed into nested format: lang/en-nested.json");
