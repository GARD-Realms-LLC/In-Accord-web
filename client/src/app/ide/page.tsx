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
	const [copied, setCopied] = useState(false);
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
		<div className="flex flex-col min-h-screen">
			<div className="flex-1">
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
					<button
						className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(code);
								setCopied(true);
								setTimeout(() => setCopied(false), 1500);
							} catch (e) {
								alert('Failed to copy!');
							}
						}}
					>
						Copy Code
					</button>
								{copied && (
								  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-all">
								    Code copied to clipboard!
								  </div>
								)}
					<button
						className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
						onClick={() => setCode("")}
					>
						Clear Editor
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
			{/* Footer from homepage */}
			<div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-auto sticky bottom-0">
				<div className="flex justify-center items-center gap-3 mb-3">
					<a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#5865F2]">
							<path d="M20.317 4.369A19.791 19.791 0 0 0 16.558 3c-.19.335-.41.78-.563 1.137a18.27 18.27 0 0 0-4.01 0A8.84 8.84 0 0 0 11.422 3c-1.33.242-2.63.62-3.86 1.137C4.913 6.354 3.924 8.62 4.13 12.02c1.4 1.05 2.75 1.69 4.08 2.1.33-.46.62-.95.87-1.46-.48-.18-.94-.4-1.38-.66.12-.09.24-.18.36-.28 2.64 1.23 5.49 1.23 8.09 0 .12.1.24.19.36.28-.44.26-.9.48-1.38.66.25.51.54 1 .87 1.46 1.33-.41 2.68-1.05 4.08-2.1.33-5.22-.92-7.46-2.74-7.651ZM9.68 11.21c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.44-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Zm4.64 0c-.79 0-1.43.72-1.43 1.6 0 .88.64 1.6 1.43 1.6.79 0 1.43-.72 1.43-1.6 0-.88-.64-1.6-1.43-1.6Z" />
						</svg>
					</a>
					<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1877F2]">
							<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
						</svg>
					</a>
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0A66C2]">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
						</svg>
					</a>
					<a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black dark:text-white">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
					</a>
				</div>
				<p className="text-center text-xs text-gray-600 dark:text-gray-400">
					<span className="font-medium">&copy; 2026 In-Accord</span>
					<span className="mx-1">|</span>
					<span>GARD Realms LLC</span>
				</p>
			</div>
		</div>
	);
}

export default IDE

