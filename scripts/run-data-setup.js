const { exec } = require('child_process');
const path = require('path');

// Function to execute a command
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n> Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      console.log(stdout);
      resolve();
    });
  });
}

// Main function to run all scripts in sequence
async function runAllScripts() {
  try {
    console.log('=== Starting Data Setup Process ===');
    
    // 1. Generate customers
    await runCommand('node scripts/generate-dummy-customers.js');
    
    // 2. Generate transactions in the database
    await runCommand('node scripts/generate-dummy-data.js');
    
    // 3. Generate CSV file for import testing
    await runCommand('node scripts/generate-dummy-csv.js');
    
    console.log('\n=== Data Setup Complete! ===');
    console.log('You can now test the application with the generated data.');
    console.log('The dummy_transaksi.csv file can be used to test the import functionality.');

  } catch (error) {
    console.error('Error running scripts:', error);
  }
}

// Run the main function
runAllScripts(); 
const path = require('path');

// Function to execute a command
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n> Running: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      
      console.log(stdout);
      resolve();
    });
  });
}

// Main function to run all scripts in sequence
async function runAllScripts() {
  try {
    console.log('=== Starting Data Setup Process ===');
    
    // 1. Generate customers
    await runCommand('node scripts/generate-dummy-customers.js');
    
    // 2. Generate transactions in the database
    await runCommand('node scripts/generate-dummy-data.js');
    
    // 3. Generate CSV file for import testing
    await runCommand('node scripts/generate-dummy-csv.js');
    
    console.log('\n=== Data Setup Complete! ===');
    console.log('You can now test the application with the generated data.');
    console.log('The dummy_transaksi.csv file can be used to test the import functionality.');

  } catch (error) {
    console.error('Error running scripts:', error);
  }
}

// Run the main function
runAllScripts(); 