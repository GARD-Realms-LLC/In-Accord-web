"use client";
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { dracula } from "@uiw/codemirror-theme-dracula";

const IDE = (props: any) => {
	const [code, setCode] = useState<string>(`body {\n  background: #f9fafb;\n  color: #222;\n}`);
	// File input ref for import
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	// Import CSS file handler
	const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			setCode(event.target?.result as string || '');
		};
		reader.readAsText(file);
	};

	// Export CSS file handler
	const handleExport = () => {
		const blob = new Blob([code], { type: 'text/css' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'style.css';
		document.body.appendChild(a);
		a.click();
		setTimeout(() => {
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, 100);
	};

	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">CSS IDE</h1>
			<div className="flex gap-4 mb-4">
				<button
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
					onClick={() => fileInputRef.current?.click()}
				>
					Import CSS
				</button>
				<input
					type="file"
					accept=".css,text/css"
					ref={fileInputRef}
					style={{ display: 'none' }}
					onChange={handleImport}
				/>
				<button
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
					onClick={handleExport}
				>
					Export CSS
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
					extensions={[css()]}
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

