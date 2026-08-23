const fs = require('fs');
const path = require('path');

const syllabusPath = path.join(__dirname, 'src', 'data', 'icaiSyllabus.ts');
let content = fs.readFileSync(syllabusPath, 'utf8');

content = content.replace(/status:\s*'(completed|revised|learning|mastered)'/g, "status: 'not_started'");
content = content.replace(/revisionCount:\s*\d+/g, 'revisionCount: 0');
content = content.replace(/questionsSolved:\s*\d+/g, 'questionsSolved: 0');
content = content.replace(/accuracy:\s*\d+/g, 'accuracy: 0');
content = content.replace(/confidenceScore:\s*\d+/g, 'confidenceScore: 1');
content = content.replace(/completed:\s*true/g, 'completed: false');

fs.writeFileSync(syllabusPath, content, 'utf8');
console.log('icaiSyllabus.ts successfully reset to Day 0 zero progress.');
