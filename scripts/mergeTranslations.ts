const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "../");
const translationsDir = path.resolve(rootDir, "./assets/translations");
// Set your base language translation file here
const extractedMessagesPath = path.resolve(translationsDir, "./en.json");

const languages = ["fr", "es", "de", "it", "pt"]; // Add your target languages here

// Read extracted messages
const extractedMessages = JSON.parse(
  fs.readFileSync(extractedMessagesPath, "utf8")
);

for (const lang of languages) {
  const translationPath = path.resolve(translationsDir, `${lang}.json`);
  let existingTranslations = {};

  // Read existing translations if file exists
  if (fs.existsSync(translationPath)) {
    existingTranslations = JSON.parse(fs.readFileSync(translationPath, "utf8"));
  }

  // Merge messages
  const mergedTranslations = { ...extractedMessages, ...existingTranslations };

  // Write merged translations back to file
  fs.writeFileSync(
    translationPath,
    JSON.stringify(mergedTranslations, null, 2),
    "utf8"
  );
}

console.log("Translations merged successfully.");
