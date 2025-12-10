// src/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "40px",
        marginBottom: "-15px",
        padding: "10px",
        backgroundColor: "#f7d8d8ff",
        textAlign: "center",
        borderTop: "1px solid #ddd",
      }}
    >
      <p style={{ fontSize: "14px", margin: "5px" }}>
        <strong>Class Project:</strong> Web Application Development with React
      </p>

      <p style={{ fontSize: "14px", margin: "5px" }}>
        <strong>Team Members:</strong>
        <br />
        Sai Ram Reddy Tippireddy (SaiRamReddyTippire@lewisu.edu)  
        <br />
        Shiva Lakshmi Renu Yama (ShivaLakshmiRenuYa@lewisu.edu)
      </p>

      <p style={{ fontSize: "12px", color: "#666" }}>
        © {new Date().getFullYear()} Team Project. All Rights Reserved.
      </p>
    </footer>
  );
}
