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
  const [uploads, setUploads] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [finishedIds, setFinishedIds] = useState([]);
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

  const handleFinished = (id) => {
    setFinishedIds((prev) => [id, ...prev]);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-blue-950 py-10">
      <div className="w-full max-w-lg bg-blue-900 rounded-xl shadow-lg p-8 border border-blue-700">
        <h1 className="text-2xl font-bold text-blue-100 mb-6">Upload Plugin / Theme / CSS Mod</h1>
        <form onSubmit={e => { e.preventDefault(); handleUpload(); }}>
          <div className="flex flex-col gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="rounded p-2 bg-blue-800 text-blue-100" required />
            <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="rounded p-2 bg-blue-800 text-blue-100" />
            <input name="version" value={form.version} onChange={handleChange} placeholder="Version" className="rounded p-2 bg-blue-800 text-blue-100" />
            <input name="authorId" value={form.authorId} onChange={handleChange} placeholder="In-Accord Id" className="rounded p-2 bg-blue-800 text-blue-100" />
            <input name="donate" value={form.donate} onChange={handleChange} placeholder="Donate Link" className="rounded p-2 bg-blue-800 text-blue-100" />
            <input name="patreon" value={form.patreon} onChange={handleChange} placeholder="Patreon Link" className="rounded p-2 bg-blue-800 text-blue-100" />
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="rounded p-2 bg-blue-800 text-blue-100" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="rounded p-2 bg-blue-800 text-blue-100" />
            <select name="category" value={form.category} onChange={handleChange} className="rounded p-2 bg-blue-800 text-blue-100">
              <option>Plugins</option>
              <option>Themes</option>
              <option>CSS Mods</option>
            </select>
            <div className="flex gap-4">
              <button type="button" onClick={handleClear} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow">Clear Form</button>
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow">Submit</button>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <input type="file" accept=".json,.js" id="addFile" ref={fileInputRef} className="block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800" />
              <label htmlFor="addFile" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-6 rounded shadow cursor-pointer text-sm min-w-30 text-center whitespace-nowrap">Add File</label>
            </div>
            <div className="text-xs text-blue-300 mt-1 ml-1">Files must be .json or .js files only!</div>
          </div>
        </form>
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
              <div className="text-blue-300 mb-1">By: {item.author || "Mod Author"}</div>
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