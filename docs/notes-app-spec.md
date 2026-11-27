# Note-taking app specification

Status: draft. Source: issue #10 (planned in the project room, approved by cx).

This document records what has been agreed and, separately, what has not.
Only the "Agreed features" section is a requirement. Nothing under "Open
questions" may be built until it is decided and moved up.

## Agreed features

### 1. Taking notes

The user can take notes in the app.

### 2. Showing the time based on location

The app shows the current time for a location, so the time displayed follows
the location rather than a fixed clock.

### 3. Displaying the app in a selected language

The user can select a language, and the app is displayed in that language.

## Open questions

These are undecided. They are listed so they get an answer, not because they
are in scope.

### Voice message

- The content of the voice message from the project room is undecided. Nothing
  in it is a requirement until it is confirmed in writing.
- Whether voice plays any part in the app (for example, voice notes) is
  undecided.

### Taking notes

- Which operations exist beyond creating a note (edit, delete, search,
  organize).
- What a note contains (plain text only, or formatting and attachments).
- Where notes are stored, and whether they sync between devices.

### Time based on location

- How the location is determined (device location, a location the user picks,
  or both), and what is shown when no location is available.
- Whether there is a default location, and which one.
- Whether the time is shown app-wide or attached to each note (for example, as
  a timestamp).
- The time and date format, and whether it follows the selected language.

### Selected language

- Which languages are supported, and which is the default.
- Whether the selection applies only to the app's interface or also to note
  content.
- Whether right-to-left languages are supported.
- Whether the selection is remembered between sessions.

### General

- Target platform (web, mobile, desktop).
- Whether the app needs accounts or sign-in.
