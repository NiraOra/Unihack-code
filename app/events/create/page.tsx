"use client";  // Required for interactive components

import { useState } from "react";

export default function CreateEventPage() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="container">
      <h1>Create a New Event</h1>
      <button
        className="generate-invite-button"
        onClick={() => setShowEditor(true)}
      >
        🎨 Generate Invite
      </button>

      {showEditor && <p>🎨 Invitation Editor will go here</p>}
    </div>
  );
}
