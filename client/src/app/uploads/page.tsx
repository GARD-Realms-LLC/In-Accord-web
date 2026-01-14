"use client";
import React, { useState, useRef } from "react";

const initialForm = {
  name: "",
  author: "",
  description: "",
  version: "",
  invite: "",
  authorId: "",
  authorLink: "",
  donate: "",
  patreon: "",
  website: "",
  source: "",
  category: "Plugins"
};

const Uploads = () => {
  const [form, setForm] = useState(initialForm);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [finishedIds, setFinishedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = () => {
    if (!form.name) return alert('Name is required');
    const newUpload = { ...form, id: Date.now(), imageUrl: null };
    setUploads((prev) => [newUpload, ...prev]);
    setSubmittedIds((prev) => [newUpload.id, ...prev]);
    setForm(initialForm);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    setForm(initialForm);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFinished = async (id) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(form));
      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
        formData.append('file', fileInputRef.current.files[0]);
      }
      await fetch('/api/save-mod-file', {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to save mod file:', e);
    }
    setFinishedIds((prev) => [id, ...prev]);
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      setShowPreview(false);
      setForm(initialForm);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-blue-950 py-10">
      <div className="w-full max-w-lg bg-blue-900 rounded-xl shadow-lg p-8 border border-blue-700 relative">
                {showModal && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
                      <span className="text-2xl font-bold text-blue-800 mb-2">Submitted for approval</span>
                    </div>
                  </div>
                )}
        <h1 className="text-2xl font-bold text-blue-100 mb-6">Upload Plugin / Theme / CSS Mod</h1>
        {showPreview ? (
          <div className="bg-blue-900 rounded-xl shadow-lg p-6 border border-blue-700 mt-4">
            <h2 className="text-xl font-bold text-blue-100 mb-4">Preview</h2>
            <div className="flex flex-col gap-2">
              {form.imageUrl && (
                <div className="w-32 h-32 flex items-center justify-center mb-2 overflow-hidden rounded bg-gray-900">
                  <img src={form.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div><span className="font-semibold text-blue-200">MOD Name:</span> {form.name}</div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-blue-200">
                  <path fillRule="evenodd" d="M10 2a5 5 0 100 10 5 5 0 000-10zM2 16a8 8 0 1116 0v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1z" clipRule="evenodd" />
                </svg>
                <span><span className="font-semibold text-blue-200">MOD Author:</span> {form.author}</span>
              </div>
              <div><span className="font-semibold text-blue-200">Mod Version:</span> {form.version}</div>
              <div><span className="font-semibold text-blue-200">MOD Description:</span> {form.description}</div>
              <div><span className="font-semibold text-blue-200">json or js code:</span>
                <pre
                  className="bg-gray-800 text-gray-100 rounded p-2 mt-1 whitespace-pre-wrap overflow-auto resize-y"
                  style={{ maxHeight: '8em', minHeight: '5em' }}
                >
                  {form.code ? form.code.split('\n').slice(0, 5).join('\n') : ''}
                </pre>
              </div>
              <div className="text-center"><span className="font-semibold text-blue-200">Category:</span> {form.category}</div>
              <div className="flex flex-row gap-4 justify-center mt-2">
                {form.donate ? (
                  <a href={form.donate} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-pink-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline w-6 h-6 align-text-bottom">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-pink-300 align-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline w-6 h-6 align-text-bottom opacity-50">
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                  </span>
                )}
                {form.github ? (
                  <a href={form.github} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline w-6 h-6 align-text-bottom">
                      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
                    </svg>
                  </a>
                ) : (
                  <span className="text-blue-300 align-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline w-6 h-6 align-text-bottom opacity-50">
                      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.687-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.594 1.028 2.687 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
                    </svg>
                  </span>
                )}
                {form.website ? (
                  <a href={form.website} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline w-6 h-6 align-text-bottom">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c2.485 0 4.5 4.03 4.5 9s-2.015 9-4.5 9-4.5-4.03-4.5-9 2.015-9 4.5-9zm0 0v18" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-blue-300 align-middle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline w-6 h-6 align-text-bottom opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c2.485 0 4.5 4.03 4.5 9s-2.015 9-4.5 9-4.5-4.03-4.5-9 2.015-9 4.5-9zm0 0v18" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow" onClick={() => setShowPreview(false)}>
                Edit
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow" onClick={() => handleFinished(Date.now())}>
                Finished
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setShowPreview(true); }}>
            <div className="flex flex-col gap-4">
              {/* Picture Preview Box */}
              <div className="flex flex-col items-center mb-2">
                <div className="w-32 h-32 bg-blue-800 rounded-lg flex items-center justify-center overflow-hidden border border-blue-600">
                  {form.imageUrl ? (
                    <img src={form.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-blue-300 text-xs">Image Preview</span>
                  )}
                </div>
                <label className="mt-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded shadow cursor-pointer text-xs">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = ev => {
                          if (ev.target && typeof ev.target.result === 'string') {
                            setForm(prev => ({ ...prev, imageUrl: ev.target.result }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <input name="name" value={form.name} onChange={handleChange} placeholder="MOD Name" className="rounded p-2 bg-gray-800 text-gray-100" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="MOD Description" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="author" value={form.author} onChange={handleChange} placeholder="MOD Author" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="version" value={form.version} onChange={handleChange} placeholder="Mod Version" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="authorId" value={form.authorId} onChange={handleChange} placeholder="In-Accord Id" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="donate" value={form.donate} onChange={handleChange} placeholder="Donate Link" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="patreon" value={form.patreon} onChange={handleChange} placeholder="Patreon Link" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="donate" value={form.donate || ''} onChange={handleChange} placeholder="Donate Link" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="github" value={form.github || ''} onChange={handleChange} placeholder="GitHub" className="rounded p-2 bg-gray-800 text-gray-100" />
              <input name="website" value={form.website} onChange={handleChange} placeholder="Website Link" className="rounded p-2 bg-gray-800 text-gray-100" />
              <textarea
                name="code"
                value={form.code || ''}
                onChange={handleChange}
                placeholder="json or js code"
                className="rounded p-2 bg-gray-800 text-gray-100 mt-2"
                rows={6}
                style={{ resize: 'vertical' }}
              />
              <select name="category" value={form.category} onChange={handleChange} className="rounded p-2 bg-gray-800 text-gray-100">
                <option>Plugins</option>
                <option>Plugin-Config</option>
                <option>Themes</option>
                <option>Theme Config</option>
                <option>CSS Mods</option>
                <option>CSS Config</option>
              </select>
              <div className="flex gap-4">
                <button type="button" onClick={handleClear} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">Clear Form</button>
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow">Submit</button>
                <button type="button" onClick={() => window.location.href = '/ide'} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded shadow">Open IDE</button>
              </div>
              <div className="flex gap-2 items-center mt-2">
                <label htmlFor="addFile" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-6 rounded shadow cursor-pointer text-sm min-w-30 text-center whitespace-nowrap">Add File
                  <input
                    type="file"
                    accept=".json,.js"
                    id="addFile"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files && e.target.files[0];
                      setSelectedFileName(file ? file.name : "");
                    }}
                  />
                </label>
                {selectedFileName && (
                  <span className="text-blue-200 text-xs ml-2">{selectedFileName}</span>
                )}
              </div>
              <div className="text-xs text-blue-300 mt-1 ml-1">Files must be .json or .js files only!</div>
            </div>
          </form>
        )}
      </div>

      {/* Show submitted form(s) as styled blocks below the form */}
      <div className="w-full max-w-lg flex flex-col items-center gap-6 mt-8">
        {uploads.map((item, idx) => {
          if (submittedIds.includes(item.id)) {
            return (
              <div key={item.id || idx} className="w-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-xl p-6 mb-6 shadow-md border border-blue-300 dark:border-blue-700 text-xl font-semibold text-blue-700 dark:text-blue-200 transition-all duration-300">
                Submitted!
              </div>
            );
          }
          if (finishedIds.includes(item.id)) {
            return null;
          }
          return (
            <div key={item.id || idx} className="w-full bg-blue-950 border border-blue-800 rounded-xl shadow-md p-6 flex flex-col items-center relative">
              {/* Picture preview */}
              <div className="w-24 h-24 bg-blue-900 border-2 border-blue-700 rounded-xl flex items-center justify-center overflow-hidden mb-3">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="Preview" className="object-cover w-full h-full rounded-xl" />
                ) : (
                  <span className="text-blue-400">No Image</span>
                )}
              </div>
              <div className="text-xl font-bold text-blue-200 mb-1">{item.name || "Mod Name"}</div>
              <div className="text-blue-500 text-sm mb-1 font-semibold">{item.category || "Plugins"}</div>
              <div className="text-blue-400 text-sm mb-1"><span className="font-semibold">Version:</span> {item.version || "-"}</div>
              <div className="text-blue-300 mb-1 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5 text-blue-200">
                  <path fillRule="evenodd" d="M10 2a5 5 0 100 10 5 5 0 000-10zM2 16a8 8 0 1116 0v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1z" clipRule="evenodd" />
                </svg>
                <span>By: {item.author || "Mod Author"}</span>
              </div>
              <div className="text-blue-100 mb-2 text-center">{item.description || "Mod Description"}</div>
              <div className="flex flex-wrap justify-center gap-3 text-blue-400 text-sm">
                <div><span className="font-semibold">In-Accord Id:</span> {item.authorId || "-"}</div>
                <div className="w-full flex flex-row justify-center gap-4 mt-2">
                  <div>
                    {item.donate ? (
                      <a href={item.donate} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-semibold text-pink-400 hover:underline" title="Donate">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline w-5 h-5 align-text-bottom mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                        Donate
                      </a>
                    ) : (
                      <span className="inline-flex items-center font-semibold text-pink-400 opacity-50 cursor-not-allowed" title="No donate link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline w-5 h-5 align-text-bottom mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                        Donate
                      </span>
                    )}
                  </div>
                  <div>
                    {item.patreon ? (
                      <a href={item.patreon} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-semibold text-orange-400 hover:underline" title="Patreon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="inline w-5 h-5 align-text-bottom mr-1" fill="none"><circle cx="22" cy="16" r="10" fill="#F96854"/><rect x="4" y="4" width="6" height="24" rx="3" fill="#232338"/></svg>
                        Patreon
                      </a>
                    ) : (
                      <span className="inline-flex items-center font-semibold text-orange-400 opacity-50 cursor-not-allowed" title="No patreon link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="inline w-5 h-5 align-text-bottom mr-1" fill="none"><circle cx="22" cy="16" r="10" fill="#F96854"/><rect x="4" y="4" width="6" height="24" rx="3" fill="#232338"/></svg>
                        Patreon
                      </span>
                    )}
                  </div>
                </div>
                <div><span className="font-semibold">Website:</span> {item.website || "-"}</div>
              </div>
              <div className="w-full flex justify-center mt-6">
                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow transition-colors duration-200" onClick={() => handleFinished(item.id)}>
                  Finished
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Uploads;