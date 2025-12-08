import React, { useState, useEffect } from "react";

const baseUrl = process.env.REACT_APP_BLOB_BASE_URL;
const container = process.env.REACT_APP_BLOB_CONTAINER;
const sasToken = process.env.REACT_APP_BLOB_SAS_TOKEN;

export default function AzureFiles() {
  const [file, setFile] = useState(null);
  const [blobs, setBlobs] = useState([]);
  const [status, setStatus] = useState("");
  const [showFiles, setShowFiles] = useState(false);

  const containerUrl = `${baseUrl}/${container}${sasToken}`;

  async function handleUpload() {
    if (!file) return;
    try {
      setStatus("Uploading...");
      const uploadUrl = `${baseUrl}/${container}/${encodeURIComponent(
        file.name
      )}${sasToken}`;

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      setStatus("Upload complete");
      setFile(null);
      await loadBlobs();
    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
    }
  }

  async function loadBlobs() {
    try {
      setStatus("Loading files...");
      const listUrl = `${containerUrl}&restype=container&comp=list`;
      const response = await fetch(listUrl);
      const text = await response.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const blobNodes = Array.from(xml.getElementsByTagName("Name"));
      const names = blobNodes.map((n) => n.textContent);

      setBlobs(names);
      setStatus("");
    } catch (error) {
      console.error(error);
      setStatus("Error loading files");
    }
  }

  useEffect(() => {
    loadBlobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

return (
  <section style={{ marginTop: "40px", textAlign: "center" }}>
    <h2>Azure Blob Storage — File Upload</h2>

    <div style={{ marginTop: "15px" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        disabled={!file}
        style={{ marginLeft: "10px", padding: "6px 12px" }}
      >
        Upload
      </button>
    </div>

    <p>{status}</p>

    {/* Toggle Button */}
    <button
      onClick={() => setShowFiles((prev) => !prev)}
      style={{
        marginTop: "25px",
        marginBottom: "20px",
        padding: "10px 25px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "6px",
        border: "1px solid black",
      }}
    >
      {showFiles ? "Uploaded Files ▲" : "Uploaded Files ▼"}
    </button>

    {/* File List */}
    {showFiles && (
      <ul style={{ marginTop: "15px", listStyleType: "none", padding: 0 }}>
        {blobs.length === 0 && <p>No files uploaded yet.</p>}
        {blobs.map((name) => {
          const fileUrl = `${baseUrl}/${container}/${encodeURIComponent(name)}${sasToken}`;
          return (
            <li
              key={name}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
                marginBottom: "12px",
              }}
            >
              {/* Preview Link */}
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: "18px" }}
              >
                {name}
              </a>

              {/* Direct Download Button */}
              <a
                href={fileUrl}
                download={name}   // forces direct download
                style={{
                  padding: "6px 12px",
                  cursor: "pointer",
                  borderRadius: "6px",
                  border: "1px solid #666",
                  textDecoration: "none",
                }}
              >
                Download
              </a>
            </li>
          );
        })}
      </ul>
    )}
  </section>
);
}
