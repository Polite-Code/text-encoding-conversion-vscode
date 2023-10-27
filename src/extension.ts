import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let base64CopyDisposable = vscode.commands.registerCommand('extension.base64Copy', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const encoded = Buffer.from(text).toString('base64');

            vscode.env.clipboard.writeText(encoded);
        }
    });

    let base64PasteDisposable = vscode.commands.registerCommand('extension.base64Paste', async () => {
        const editor = vscode.window.activeTextEditor;
        const clipboardContent = await vscode.env.clipboard.readText();

        if (editor && clipboardContent) {
            try {
                const decoded = Buffer.from(clipboardContent, 'base64').toString('utf8');
                editor.edit(editBuilder => {
                    if (editor.selection.isEmpty) {
                        const position = editor.selection.active;
                        editBuilder.insert(position, decoded);
                    } else {
                        editBuilder.replace(editor.selection, decoded);
                    }
                });
            } catch (error) {
                vscode.window.showErrorMessage('Failed to decode and paste from Base64!');
            }
        }
    });

    context.subscriptions.push(base64CopyDisposable, base64PasteDisposable);
}



// This method is called when your extension is deactivated
export function deactivate() {}
