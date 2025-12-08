import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { auth, signInWithGoogle, logout, db } from "./firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import AzureFiles from "./AzureFiles";

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Toggle state for panels
  const [activePanel, setActivePanel] = useState(null);

  // DOG APP STATES
  const [breeds, setBreeds] = useState([]);
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // AUTH LISTENER
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setUserData(snap.data());

        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        setAllUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } else {
        setUserData(null);
        setAllUsers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // FETCH DOG BREEDS
  useEffect(() => {
    async function fetchBreeds() {
      const res = await fetch("https://dog.ceo/api/breeds/list/all");
      const data = await res.json();
      setBreeds(Object.keys(data.message));
    }
    fetchBreeds();
  }, []);

  async function fetchImagesForBreed(breed) {
    const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
    const data = await res.json();
    setImages(data.message);
    setIndex(0);
  }

  const nextImage = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images]);

  function prevImage() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function togglePlay() {
    setPlaying(!playing);
  }

  // SLIDESHOW TIMER
  useEffect(() => {
    let timer;
    if (playing) {
      timer = setInterval(() => nextImage(), 3000);
    }
    return () => clearInterval(timer);
  }, [playing, nextImage]);

  // =================== UI =====================
  return (
    <main>
      {!user ? (
        <>
          <h1>Dogs App — Login Required</h1>
          <button onClick={signInWithGoogle}>Login with Google</button>
        </>
      ) : (
        <>
          <h2>Welcome, {user.displayName}</h2>
          <button onClick={logout}>Logout</button>

          {/* DOG SECTION */}
          <h1 style={{ marginTop: "20px" }}>Dogs — Fetch, Promises & Async/Await</h1>

          <label htmlFor="breed">Choose breed:</label>
          <select id="breed" onChange={(e) => fetchImagesForBreed(e.target.value)}>
            <option value="">Select breed</option>
            {breeds.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

          <div id="slideshow" aria-live="polite" style={{ marginTop: "20px" }}>
            {images.length > 0 && (
              <img
                src={images[index]}
                alt={`Dog ${index + 1} of ${images.length}`}
                style={{ width: "300px", borderRadius: "10px" }}
              />
            )}
            <div id="controls">
              <button onClick={prevImage}>Prev</button>
              <button onClick={nextImage}>Next</button>
              <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
            </div>
          </div>

          <hr style={{ marginTop: "30px" }} />

          <AzureFiles />

          {/* PANEL BUTTONS */}
          <button onClick={() => setActivePanel("me")}>Your Login Information</button>
          <button onClick={() => setActivePanel("all")}>All Users Login History</button>

          {/* USER INFO PANEL */}
          {activePanel === "me" && userData && (
            <div style={{ marginTop: "20px" }}>
              <h3>Your Login Information</h3>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Last Login:</strong> {userData.lastLogin}</p>
              <p><strong>Total Logins:</strong> {userData.logins}</p>
            </div>
          )}

          {/* ALL USERS PANEL */}
          {activePanel === "all" && (
            <div style={{ marginTop: "20px" }}>
              <h3>All Users Login History</h3>
              <table border="1" cellPadding="8" style={{ width: "80%", margin: "auto" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total Logins</th>
                    <th>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.logins}</td>
                      <td>{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default App;
