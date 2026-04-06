// Test the regex pattern used in dbConfig.js

const testUrl = 'sqlserver://.\SQLEXPRESS;database=transferx;integratedSecurity=true;encrypt=false;trustServerCertificate=true';

const match = testUrl.match(/sqlserver:\/\/([^;]+)/);
console.log('Input URL:', testUrl);
console.log('Regex match result:', match);
if (match && match[1]) {
    console.log('Captured SERVER:', match[1]);
} else {
    console.log('NO MATCH!');
}
