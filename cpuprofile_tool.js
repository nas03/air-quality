const fs = require('fs');

// Load the .cpuprofile file
const profile = JSON.parse(
    fs.readFileSync(
        '/Users/anhson/Documents/Projects/air-quality/vscode-profile-2025-01-01-12-31-30.cpuprofile',
        'utf-8'
    )
);

// Extract timestamps and calculate the total execution time
if (profile.timeDeltas) {
    // If `timeDeltas` is present, use it for a precise calculation
    const totalExecutionTime = profile.timeDeltas.reduce(
        (sum, delta) => sum + delta,
        0
    ) / 1000; // Convert to milliseconds
    console.log(`Total Execution Time: ${totalExecutionTime} milliseconds`);
} else if (profile.endTime && profile.startTime) {
    // If startTime and endTime are present, use them directly
    const totalExecutionTime = (profile.endTime - profile.startTime) / 1000; // Convert to milliseconds
    console.log(`Total Execution Time: ${totalExecutionTime} milliseconds`);
} else {
    console.log('Unable to calculate total execution time.');
}
