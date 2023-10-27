import * as vscode from 'vscode';
import * as assert from 'assert';
import { after } from 'mocha';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	after(async () => {
		// Clean up and close documents after testing
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	test('Base64 Copy', async () => {
		// Create an in-memory document with some content
		const testDoc = await vscode.workspace.openTextDocument({ content: 'test', language: 'plaintext' });
		await vscode.window.showTextDocument(testDoc);

		const testEditor = vscode.window.activeTextEditor!;
		assert.ok(testEditor, 'No active text editor');

		// Select text in the editor
		const startPosition = new vscode.Position(0, 0);
		const endPosition = new vscode.Position(0, 4); 
		const selection = new vscode.Selection(startPosition, endPosition);
		testEditor.selection = selection;

		// Execute the base64 copy command
		await vscode.commands.executeCommand('extension.base64Copy');

		// Get clipboard content
		const clipboardContent = await vscode.env.clipboard.readText();
		const originalText = testEditor.document.getText(selection);
		const expectedBase64 = Buffer.from(originalText).toString('base64');

		assert.strictEqual(clipboardContent, expectedBase64, 'Clipboard content did not match expected Base64 value');
	});

	test('Base64 Paste', async () => {
		// Create an in-memory document with some content
		const testDoc = await vscode.workspace.openTextDocument({ content: '', language: 'plaintext' });
		await vscode.window.showTextDocument(testDoc);

		const testEditor = vscode.window.activeTextEditor!;
		assert.ok(testEditor, 'No active text editor');

		// Setup clipboard with known Base64 content
		const sampleText = "sample";
		const sampleBase64 = Buffer.from(sampleText).toString('base64');
		await vscode.env.clipboard.writeText(sampleBase64);

		// Set cursor position
		const position = new vscode.Position(0, 0); 
		testEditor.selection = new vscode.Selection(position, position);

		// Execute the base64 paste command
		await sleep(200);  // wait for 200ms
		await vscode.commands.executeCommand('extension.base64Paste');
		await sleep(200);  // wait for 200ms


		// Validate the decoded content
		const lineText = testEditor.document.lineAt(position.line).text;

		assert.strictEqual(lineText, sampleText, 'Decoded text from clipboard did not match expected value');
	});
});
