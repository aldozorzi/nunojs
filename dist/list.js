import fs from 'fs';
export function getList() {
    const dir = fs.readdirSync('patterns');
    const result = dir.map((string) => `${string}`).join('\n');
    process.stdout.write(result || "");
}
//# sourceMappingURL=list.js.map