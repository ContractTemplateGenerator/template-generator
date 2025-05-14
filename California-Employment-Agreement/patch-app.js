// This is a patch to modify the end of the california-employment-agreement.js file
// and replace the ReactDOM.render call with window.App = App

// Create a backup of the original file
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'california-employment-agreement.js');
const backupPath = path.join(__dirname, 'california-employment-agreement.js.bak');

try {
  // Read the file content
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Create a backup
  fs.writeFileSync(backupPath, fileContent);
  
  // Replace the ReactDOM.render call
  const modifiedContent = fileContent.replace(
    /\/\/ Mount the React app\s*ReactDOM\.render\(<App \/>, document\.getElementById\('root'\)\);/,
    "// Make App component globally available\nwindow.App = App;"
  );
  
  // Write the modified content back to the file
  fs.writeFileSync(filePath, modifiedContent);
  
  console.log('Successfully patched california-employment-agreement.js');
} catch (err) {
  console.error('Error patching file:', err);
}
