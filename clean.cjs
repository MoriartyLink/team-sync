const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\s*addRecurringAvailability,\n\s*removeRecurringAvailability,/g, '');

const shortcutsRegex = /\n\s*<div className="mt-8 pt-8 border-t border-white\/5">\s*<h3 className="text-\[10px\] font-display font-bold text-white\/20 uppercase tracking-\[0\.2em\] mb-4">Shortcuts<\/h3>[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(shortcutsRegex, '');

const stateRegex = /\s*const \[showRecurrenceTool, setShowRecurrenceTool\] = useState\(false\);\n\s*const \[recurrenceData, setRecurrenceToolData\] = useState\(\{[\s\S]*?type: 'add' as 'add' \| 'remove'\n\s*\}\);/g;
code = code.replace(stateRegex, '');

const applyRecurrenceRegex = /\n\s*const handleApplyRecurrence = async \(\) => \{[\s\S]*?setShowRecurrenceTool\(false\);\n\s*\} finally \{\n\s*setIsCopying\(false\);\n\s*\}\n\s*\};\n/g;
code = code.replace(applyRecurrenceRegex, '\n');

const uiRegex = /\s*<div className="flex items-center bg-white\/5 rounded-sm border border-white\/10 overflow-hidden backdrop-blur-md relative">\s*<button[\s\S]*?Recurring Entry\n\s*<\/button>[\s\S]*?<\/div>\n\s*\)\}\n\s*<\/div>/;
code = code.replace(uiRegex, '');

fs.writeFileSync('src/App.tsx', code);
console.log('Cleanup complete');
