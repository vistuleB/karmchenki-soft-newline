import * as vscode from 'vscode';
import { AssertionError } from 'assert';

function softNewline(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	function eol_of(doc: vscode.TextDocument, pos: vscode.Position) {
		return doc.lineAt(pos.line).range.end;
	}

	function pos2sel(pos: vscode.Position): vscode.Selection {
		return new vscode.Selection(pos, pos);
	}
	editor.selections = editor.selections.map(s => pos2sel(eol_of(editor.document, s.active)));
	editor.selections.forEach(s => edit.insert(s.active, '\n'));
	vscode.commands.executeCommand('editor.action.reindentselectedlines');
	editor.selections = editor.selections.map(s => pos2sel(s.active));
}

interface VanillaCommand {
	name: string;
	func: (p1: vscode.TextEditor, p2: vscode.TextEditorEdit) => void;
}

function register_commands(extension_id: string, context: vscode.ExtensionContext, ze_list: VanillaCommand[]) {
	ze_list.forEach(z => vscode.commands.registerTextEditorCommand(extension_id + '.' + z.name, z.func));
}

export function activate(context: vscode.ExtensionContext) {
	register_commands(
		'karmchenki-soft-newline',
		context,
		[
			{ name: 'softNewline', func: softNewline }
		]
	);
}

export function deactivate() { }
