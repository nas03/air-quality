const fs = require('fs');
const profile = JSON.parse(
	fs.readFileSync(
		'/Users/anhson/Documents/Projects/air-quality/vscode-profile-2025-01-01-12-31-30.cpuprofile',
		'utf-8'
	)
);

if (profile.timeDeltas) {
	const totalExecutionTime =
		profile.timeDeltas.reduce((sum, delta) => sum + delta, 0) / 1000;
	console.log(`Total Execution Time: ${totalExecutionTime} milliseconds`);
} else if (profile.endTime && profile.startTime) {
	const totalExecutionTime = (profile.endTime - profile.startTime) / 1000;
	console.log(`Total Execution Time: ${totalExecutionTime} milliseconds`);
} else {
	console.log('Unable to calculate total execution time.');
}
