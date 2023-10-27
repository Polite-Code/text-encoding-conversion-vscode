import * as path from 'path';
import * as mocha from 'mocha';
import * as glob from 'glob';

export function run(): Promise<void> {
	// Create the mocha test
	const testRunner = new mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		const testFiles = new glob.Glob("**/**.test.js", { cwd: testsRoot });
		const testFileStream = testFiles.stream();

		testFileStream.on("data", (file) => {
			testRunner.addFile(path.resolve(testsRoot, file));
		});
		testFileStream.on("error", (err) => {
			e(err);
		});
		testFileStream.on("end", () => {
			try {
				// Run the mocha test
				testRunner.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			}
		});
	});
}
