// Simple test to check if we can connect to the database
const { exec } = require('child_process');
const path = require('path');

// Try to generate Prisma client first
console.log('Attempting to generate Prisma client...');

const prismaPath = path.join(__dirname, 'node_modules', '.bin', 'prisma');
exec(`${prismaPath} generate`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error generating Prisma client:', error.message);
    console.error('stderr:', stderr);
    return;
  }
  console.log('stdout:', stdout);
  console.log('Prisma client generated successfully!');
});
