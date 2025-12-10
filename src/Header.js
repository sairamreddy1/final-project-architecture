// src/Header.js
import React from "react";

export default function Header({ userName, onLogout }) {
  return (
    <header
      style={{
        width: "100%",
        marginTop: "-20px",
        backgroundColor: "#f7d8d8ff",
        padding: "15px 10px",
        borderBottom: "0px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left side: Welcome text */}
      <h2 style={{ margin: 0, fontWeight: "600", fontSize: "20px" }}>
        Welcome, {userName}
      </h2>

      {/* Right side: Logout button */}
      <button
        onClick={onLogout}
        style={{
          padding: "6px 14px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Logout
      </button>
    </header>
  );
}
