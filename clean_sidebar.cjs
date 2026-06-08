const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const analysisRegex = /\s*<div className="mt-8 pt-8 border-t border-white\/5">\s*<h3 className="text-\[10px\] font-display font-bold text-white\/20 uppercase tracking-\[0\.2em\] mb-4">Analysis<\/h3>\s*<AlignmentSearch[\s\S]*?\/>\s*<\/div>/;
code = code.replace(analysisRegex, '');

const overlapsRegex = /\s*<div className="mt-8 pt-8 border-t border-white\/5">\s*<div className="space-y-4">\s*\{Object\.entries\(overlaps\)[\s\S]*?<\/div>\s*<\/div>\n\s*<\/div>\n\s*<\/motion\.aside>/;
code = code.replace(overlapsRegex, '\n          </div>\n        </motion.aside>');

fs.writeFileSync('src/App.tsx', code);
console.log('Sidebar cleanup complete');
