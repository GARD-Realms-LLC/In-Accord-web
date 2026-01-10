"use client";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { json as jsonLang } from "@codemirror/lang-json";
import { dracula } from "@uiw/codemirror-theme-dracula";

const IDE = (props: any) => {
	const [mode, setMode] = useState<'css' | 'javascript' | 'json'>('css');
	const [code, setCode] = useState<string>(`body {\n  background: #f9fafb;\n  color: #222;\n}`);
	// File input ref for import
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// Import file handler (CSS, JS, or JSON)
	const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			setCode(event.target?.result as string || '');
		};
		reader.readAsText(file);
	};

	// Export file handler (CSS, JS, or JSON)
	const handleExport = () => {
		let type = 'text/plain', filename = 'file.txt';
		if (mode === 'css') { type = 'text/css'; filename = 'style.css'; }
		else if (mode === 'javascript') { type = 'application/javascript'; filename = 'script.js'; }
		else if (mode === 'json') { type = 'application/json'; filename = 'data.json'; }
		const blob = new Blob([code], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 100);
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">CSS & JavaScript IDE</h1>
			<h2 className="text-lg font-semibold mb-2 text-gray-300">
				Edit your CSS, JSON and JavaScript files here, you can load, edit, and save them from here.
			</h2>
			<div className="flex gap-4 mb-4 items-center">
				<label htmlFor="mode-select" className="font-semibold">Mode:</label>
				<select
					id="mode-select"
					className="border rounded px-2 py-1 text-sm bg-gray-800 text-white"
					value={mode}
					onChange={e => setMode(e.target.value as 'css' | 'javascript' | 'json')}
				>
					<option value="css">CSS</option>
					<option value="javascript">JavaScript</option>
					<option value="json">JSON</option>
				</select>
				<span className="text-xs text-gray-400">(Import/Export will use selected mode)</span>
			</div>
			<div className="flex gap-4 mb-4">
				<button
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
					onClick={() => fileInputRef.current?.click()}
				>
					Import File
				</button>
				<input
					type="file"
					accept={
						mode === 'css' ? '.css,text/css' :
						mode === 'javascript' ? '.js,application/javascript' :
						'.json,application/json'
					}
					ref={fileInputRef}
					style={{ display: 'none' }}
					onChange={handleImport}
				/>
				<button
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
					onClick={handleExport}
				>
					Export File
				</button>
			</div>
			<div
				className="mb-4 resize-editor"
				style={{
					minHeight: '375px',
					height: '75vh',
					width: '100%',
					position: 'relative',
					resize: 'both',
					overflow: 'auto',
					borderRadius: '8px',
					boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
					border: '2px solid #ef4444'
				}}
			>
				<CodeMirror
					value={code}
					height="100%"
					width="100%"
					extensions={
						mode === 'css' ? [css()] :
						mode === 'javascript' ? [javascript({ jsx: true })] :
						[jsonLang()]
					}
					onChange={setCode}
					theme={dracula}
					basicSetup={{ lineNumbers: true, autocompletion: true }}
					style={{ minHeight: '375px', height: '100%', width: '100%', background: '#18181b', color: '#22c55e', fontFamily: 'monospace' }}
				/>
				<style>{`
					.cm-editor, .cm-scroller, .cm-content {
						background: #18181b !important;
						color: #22c55e !important;
					}
					.resize-editor {
						resize: both;
						overflow: auto;
						position: relative;
					}
					.resize-handle {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 24px;
						height: 24px;
						cursor: se-resize;
						background: linear-gradient(135deg, #2d3748 60%, #22c55e 100%);
						border-bottom-right-radius: 8px;
						z-index: 10;
						display: flex;
						align-items: flex-end;
						justify-content: flex-end;
					}
					.resize-handle::after {
						content: '';
						display: block;
						width: 16px;
						height: 16px;
						border-right: 2px solid #22c55e;
						border-bottom: 2px solid #22c55e;
						border-radius: 0 0 4px 0;
						margin: 4px;
					}
				`}</style>
				<div className="resize-handle" />
			</div>
		</div>
	);
}

export default IDE

