"use client";

import { useState } from "react";

type UploadedFile = {
  name: string;
  file: File;
  status: "uploaded" | "processing" | "done" | "error";
  extractedName?: string;
  matchedId?: string;
  score?: number;
  manualId?: string;
};
import { Dropzone } from "@/components/Dropzone";
import "./mainStyles.css";
import { getPrimaryInsuredFromText } from "@/lib/llm";
import { getText } from "@/lib/parser";
import { findBestMatch } from "@/lib/match";
import { INSUREDS } from "./insured";

/* This is the main page the app opens up to*/

export function MainScreen() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  /* handles the drop from files */
  function handleDrop(newFiles: File[]) {
    const uploaded = newFiles.map(file => ({
      name: file.name,
      file,
      status: "uploaded" as const,
    }));
    setFiles(prev => [...prev, ...uploaded]);
  }

  /* handles the cancel from files */
  function handleCancel(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const updated = await Promise.all(
      files.map(async (fileEntry) => {
        try {

          const text = await getText(fileEntry.file);
          const extractedName = await getPrimaryInsuredFromText(text);
          const match = findBestMatch(extractedName, INSUREDS);

          if (match === "No match") {
            return {
              ...fileEntry,
              status: "done" as const,
              extractedName,
              matchedId: "No match",
            };
          } else {
            return {
              ...fileEntry,
              status: "done" as const,
              extractedName: match.name,
              matchedId: match.internalId,
              score: match.match,
            };
          }
        } catch (err) {
          console.error("LLM error:", err);
          return { ...fileEntry, status: "error" as const };
        }
      })
    );

    setFiles(updated);
  }

  return (
    <main className="main">
      <h1 className="title">Insurance Claim Parser</h1>

      {/* Dropzone component to handle file drops */}
      <Dropzone onDrop={handleDrop} />

      {/* File upload section */}
      {files.length > 0 && (
        <div className="dropBox">
          <h2 className="dropBox-heading">Uploaded Files</h2>
            <ul>
              {files.map((file, idx) => (
                <li key={idx} className="file" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{file.name}</span>
                    <div className="file-seperator">
                      <span className="file-status">{file.status}</span>
                      <button
                        className="file-cancel"
                        onClick={() => handleCancel(idx)}
                        disabled={file.status === "done"}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  {/* Displaying the extracted name and matched ID */}
                  {file.extractedName && (
                    <div className="file-result" style={{ marginTop: '0.5rem' }}>
                      <div><strong>Insured:</strong> {file.extractedName}</div>
                      <div><strong>Internal ID:</strong> {file.matchedId}</div>
                      <div><strong>Confidence:</strong> {file.score?.toFixed(2) ?? "N/A"}</div>

                      {file.matchedId === "No match" && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <label htmlFor={`manual-select-${idx}`}><strong>Pick Insured:</strong></label>
                          <select
                            id={`manual-select-${idx}`}
                            value={file.manualId || ""}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              setFiles(prev =>
                                prev.map((f, i) =>
                                  i === idx ? { ...f, manualId: selectedId } : f
                                )
                              );
                            }}
                          >
                            <option value="" disabled>Select a company...</option>
                            {INSUREDS.map(ins => (
                              <option key={ins.internalId} value={ins.internalId}>
                                {ins.name} ({ins.internalId})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </main>
  );
}
