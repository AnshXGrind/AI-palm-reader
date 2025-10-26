const fs = require('fs');

try {
  const css = fs.readFileSync('./src/styles/globals.css', 'utf8');
  const lines = css.split('\n');
  let openBraces = 0;
  let inComment = false;
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '/' && line[j+1] === '*') {
        inComment = true;
        j++;
      } else if (line[j] === '*' && line[j+1] === '/') {
        inComment = false;
        j++;
      } else if (!inComment) {
        if (line[j] === '{') {
          openBraces++;
        } else if (line[j] === '}') {
          openBraces--;
        }
      }
    }
    
    if (openBraces < 0) {
      errors.push(`Extra closing brace at line ${i+1}: ${line.trim()}`);
    }
  }

  if (openBraces > 0) {
    console.log(`Error: ${openBraces} unclosed braces found`);
  } else if (errors.length > 0) {
    errors.forEach(error => console.log(error));
  } else {
    console.log('CSS syntax appears correct');
  }
} catch (error) {
  console.error('Error reading CSS file:', error.message);
}