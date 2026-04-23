# Design Document

## Overview

The Todo Life Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript. It provides a centralized interface for daily organization with a greeting component, focus timer, task list, and quick links. All data persists via the browser's Local Storage API.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Dashboard                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Greeting Component                    │   │
│  │  [Time Display] [Date Display] [Greeting] [Name]    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌────────────────────┐    ┌────────────────────────────┐  │
│  │   Focus Timer       │    │       Task List            │  │
│  │  [MM:SS Display]    │    │  [Add Task Form]           │  │
│  │  [Start] [Stop]     │    │  [Sort Options]            │  │
│  │  [Reset]            │    │  [Task Items...]           │  │
│  └────────────────────┘    └────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Quick Links                         │   │
│  │  [Link 1] [Link 2] [Link 3] [Add Link]              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Theme Toggle                          │   │
│  │  [Light/Dark Mode Button]                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
todo-life-dashboard/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All styles (light/dark themes)
├── js/
│   └── app.js          # All JavaScript logic
└── audio/
    └── notification.mp3 # Timer completion sound (optional)
```

### GitHub Pages Deployment

This project is designed to be deployed on GitHub Pages. The static nature of the application (HTML, CSS, JavaScript only) makes it fully compatible with GitHub Pages hosting.

**Deployment Steps:**
1. Create a GitHub repository
2. Push the project files to the repository
3. Go to repository Settings → Pages
4. Select the branch (usually `main`) and root folder
5. The site will be available at `https://username.github.io/repository-name`

**No build process required** - GitHub Pages will serve the static files directly.

### Component Design

#### 1. Greeting Component

**Purpose:** Display current time, date, and personalized greeting.

**HTML Structure:**
```html
<section id="greeting-section">
  <div id="time-display">HH:MM</div>
  <div id="date-display">Weekday, Month Day</div>
  <div id="greeting-container">
    <span id="greeting-text">Good Morning,</span>
    <span id="user-name">User</span>
    <button id="edit-name-btn">Edit</button>
    <input type="text" id="name-input" class="hidden" />
  </div>
</section>
```

**Layout:** Vertical stack with time on top, date in middle, greeting/name on bottom.

**JavaScript Functions:**
- `updateTime()` - Updates time display every second
- `updateDate()` - Updates date display
- `getGreeting()` - Returns greeting based on current hour
- `editName()` - Shows input field for name editing
- `saveName()` - Saves name to Local Storage

**Data Model:**
```javascript
{
  userName: string
}
```

#### 2. Focus Timer Component

**Purpose:** Provide a customizable countdown timer for focus sessions.

**HTML Structure:**
```html
<section id="timer-section">
  <h2>Focus Timer</h2>
  <div id="timer-display-container">
    <div id="timer-display">25:00</div>
    <div id="timer-edit-controls" class="hidden">
      <input type="number" id="timer-minutes-input" min="1" max="99" value="25">
      <span>:</span>
      <input type="number" id="timer-seconds-input" min="0" max="59" value="00">
    </div>
  </div>
  <div id="timer-controls">
    <button id="start-button">Start</button>
    <button id="stop-button">Stop</button>
    <button id="reset-button">Reset</button>
    <button id="timer-edit-button">Adjust Time</button>
    <button id="timer-save-button" class="hidden">Save</button>
    <button id="timer-cancel-button" class="hidden">Cancel</button>
  </div>
</section>
```

**JavaScript Functions:**
- `startTimer()` - Begins countdown
- `stopTimer()` - Pauses countdown
- `resetTimer()` - Resets to configured duration
- `updateTimerDisplay()` - Updates MM:SS display
- `playTimerNotification()` - Plays audio when timer completes
- `formatTime(seconds)` - Converts seconds to MM:SS format
- `enterEditMode()` - Shows input fields for editing duration
- `exitEditMode(save)` - Hides input fields, optionally saving
- `loadTimerDuration()` - Loads saved duration from Local Storage
- `saveTimerDuration(duration)` - Saves duration to Local Storage

**Audio Notification Strategy:**
The `playTimerNotification()` function uses a fallback approach:
1. First, attempt to play `audio/notification.mp3` if the file exists
2. If the audio file is missing or fails to load, use the Web Audio API to generate a default notification sound programmatically

```javascript
function playTimerNotification() {
  const audio = new Audio('audio/notification.mp3');
  audio.play().catch(() => {
    // Fallback: Generate sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  });
}
```

This ensures the timer always has an audio notification regardless of whether a custom audio file is provided.

**State:**
```javascript
{
  timerDuration: number,      // configured duration in seconds
  timeRemaining: number,      // seconds remaining
  isRunning: boolean,         // timer is counting down
  isEditing: boolean,         // timer is in edit mode
  intervalId: number | null   // setInterval ID
}
```

**Local Storage:**
- Key: `dashboard_timer_duration`
- Value: Duration in seconds (string)

#### 3. Task List Component

**Purpose:** Manage tasks with optional deadline and priority.

**HTML Structure:**
```html
<section id="task-section">
  <div id="task-input-area">
    <input type="text" id="task-input" placeholder="Add a task..." />
    <input type="date" id="task-deadline" />
    <select id="task-priority">
      <option value="">No priority</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
    <button id="add-task-btn">Add</button>
  </div>
  <div id="task-sort">
    <select id="sort-select">
      <option value="creation">Creation Order</option>
      <option value="alphabetical">Alphabetical</option>
      <option value="priority">Priority</option>
      <option value="completion">Completion Status</option>
    </select>
  </div>
  <ul id="task-list">
    <!-- Task items rendered here -->
  </ul>
</section>
```

**Task Item Template:**
```html
<li class="task-item" data-id="uuid">
  <input type="checkbox" class="task-checkbox" />
  <span class="task-text">Task description</span>
  <span class="task-deadline">YYYY-MM-DD</span>
  <span class="task-priority">high/medium/low</span>
  <button class="edit-task-btn">Edit</button>
  <button class="delete-task-btn">Delete</button>
</li>
```

**JavaScript Functions:**
- `addTask(text, deadline, priority)` - Creates new task
- `editTask(id, newText)` - Updates task text
- `toggleTaskComplete(id)` - Toggles completion status
- `deleteTask(id)` - Removes task
- `sortTasks(criteria)` - Sorts task array
- `renderTasks()` - Renders task list to DOM
- `saveTasks()` - Saves to Local Storage
- `loadTasks()` - Loads from Local Storage

**Data Model:**
```javascript
{
  tasks: [
    {
      id: string,           // UUID
      text: string,
      completed: boolean,
      deadline: string | null,  // ISO date string or null
      priority: 'high' | 'medium' | 'low' | null,
      createdAt: number     // timestamp
    }
  ]
}
```

#### 4. Quick Links Component

**Purpose:** Provide shortcut buttons to favorite websites.

**HTML Structure:**
```html
<section id="links-section">
  <div id="link-form">
    <input type="text" id="link-name" placeholder="Link name" />
    <input type="url" id="link-url" placeholder="https://..." />
    <button id="add-link-btn">Add Link</button>
  </div>
  <div id="links-container" class="links-grid">
    <!-- Link buttons rendered here -->
  </div>
</section>
```

**Link Button Template:**
```html
<div class="link-item" data-id="uuid">
  <a href="URL" target="_blank" rel="noopener noreferrer">Name</a>
  <button class="delete-link-btn">×</button>
</div>
```

**Layout:** Add link form on top, links displayed in a grid below.

**JavaScript Functions:**
- `addLink(name, url)` - Creates new link
- `deleteLink(id)` - Removes link
- `renderLinks()` - Renders links to DOM
- `saveLinks()` - Saves to Local Storage
- `loadLinks()` - Loads from Local Storage

**Data Model:**
```javascript
{
  links: [
    {
      id: string,  // UUID
      name: string,
      url: string
    }
  ]
}
```

#### 5. Theme Toggle Component

**Purpose:** Switch between light and dark visual themes.

**HTML Structure:**
```html
<div id="settings-container">
  <button id="theme-toggle" class="icon-btn" title="Toggle theme">
    <span class="theme-icon">🌙</span>
  </button>
</div>
```

**JavaScript Functions:**
- `toggleTheme()` - Switches theme
- `applyTheme(theme)` - Applies theme class to document
- `saveTheme(theme)` - Saves preference to Local Storage
- `loadTheme()` - Loads preference from Local Storage
- `getSystemTheme()` - Detects OS theme preference using `prefers-color-scheme`

**State:**
```javascript
{
  theme: 'light' | 'dark'
}
```

**Initial Theme Logic:**
1. Check Local Storage for saved preference
2. If no saved preference, detect OS theme via `window.matchMedia('(prefers-color-scheme: dark)')`
3. Apply detected or saved theme

**Settings Container:** Wrapper div to allow future settings additions.

### Local Storage Schema

```javascript
{
  'dashboard_username': string,
  'dashboard_tasks': JSON.stringify(Task[]),
  'dashboard_links': JSON.stringify(Link[]),
  'dashboard_theme': 'light' | 'dark'
}
```

### CSS Architecture

**Theme Variables:**
```css
:root {
  /* Light theme (default) */
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent-color: #4a90d9;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #eaeaea;
  --text-secondary: #b0b0b0;
  --accent-color: #6db3f2;
  --border-color: #2a2a4a;
}
```

**Component Styles:**
- Base styles for layout and typography
- Component-specific styles for each section
- Utility classes (hidden, flex, etc.)
- Responsive adjustments for different screen sizes

## Correctness Properties

### Property 1: Task Round-Trip Persistence
**Requirement:** 3.10, 3.11
**Property:** FOR ALL task operations (add, edit, delete, toggle), saving to Local Storage and reloading SHALL produce an equivalent task list state.

```javascript
// Property: tasks round-trip through storage
function property_tasksRoundTrip(tasks) {
  saveTasks(tasks);
  const loaded = loadTasks();
  return JSON.stringify(tasks) === JSON.stringify(loaded);
}
```

### Property 2: Task Sort Order Invariants
**Requirement:** 3.9
**Property:** FOR EACH sort criteria, the sorted task list SHALL maintain specific invariants:
- Completion sort: All incomplete tasks appear before all complete tasks
- Alphabetical sort: Tasks are ordered alphabetically by text (case-insensitive)
- Priority sort: Tasks are ordered by priority level (high > medium > low > none)
- Creation sort: Tasks are ordered by createdAt timestamp (oldest first)

```javascript
// Property: completion sort invariant
function property_completionSortInvariant(tasks) {
  const sorted = sortTasks(tasks, 'completion');
  const firstCompleteIndex = sorted.findIndex(t => t.completed);
  if (firstCompleteIndex === -1) return true;
  return sorted.slice(firstCompleteIndex).every(t => t.completed);
}

// Property: alphabetical sort invariant
function property_alphabeticalSortInvariant(tasks) {
  const sorted = sortTasks(tasks, 'alphabetical');
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i-1].text.toLowerCase() > sorted[i].text.toLowerCase()) {
      return false;
    }
  }
  return true;
}
```

### Property 3: Timer Display Format
**Requirement:** 2.2
**Property:** FOR ALL valid time values (0-1500 seconds), the formatTime function SHALL produce a string matching the pattern MM:SS where MM is 00-25 and SS is 00-59.

```javascript
// Property: timer format always valid
function property_timerFormatValid(seconds) {
  const formatted = formatTime(seconds);
  const match = formatted.match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;
  const [, mins, secs] = match;
  return parseInt(mins) <= 25 && parseInt(secs) <= 59;
}
```

### Property 4: Links Round-Trip Persistence
**Requirement:** 4.5, 4.6
**Property:** FOR ALL link operations (add, delete), saving to Local Storage and reloading SHALL produce an equivalent link list state.

```javascript
// Property: links round-trip through storage
function property_linksRoundTrip(links) {
  saveLinks(links);
  const loaded = loadLinks();
  return JSON.stringify(links) === JSON.stringify(loaded);
}
```

### Property 5: Theme Round-Trip Persistence
**Requirement:** 5.4, 5.5
**Property:** FOR EACH theme toggle, saving to Local Storage and reloading SHALL restore the same theme.

```javascript
// Property: theme round-trip through storage
function property_themeRoundTrip(theme) {
  saveTheme(theme);
  const loaded = loadTheme();
  return theme === loaded;
}
```

### Property 6: Name Round-Trip Persistence
**Requirement:** 1.10
**Property:** FOR ALL name changes, saving to Local Storage and reloading SHALL restore the same name.

```javascript
// Property: name round-trip through storage
function property_nameRoundTrip(name) {
  saveName(name);
  const loaded = loadName();
  return name === loaded;
}
```

### Property 7: Greeting Time-Based Logic
**Requirement:** 1.3-1.6
**Property:** FOR ALL hours (0-23), the getGreeting function SHALL return the correct greeting based on time ranges:
- 5-11: "Good Morning"
- 12-16: "Good Afternoon"
- 17-20: "Good Evening"
- 21-23, 0-4: "Good Night"

```javascript
// Property: greeting matches time of day
function property_greetingMatchesTime(hour) {
  const greeting = getGreeting(hour);
  if (hour >= 5 && hour <= 11) return greeting === "Good Morning";
  if (hour >= 12 && hour <= 16) return greeting === "Good Afternoon";
  if (hour >= 17 && hour <= 20) return greeting === "Good Evening";
  return greeting === "Good Night";
}
```

### Property 8: Task ID Uniqueness
**Requirement:** 3.1
**Property:** FOR ALL tasks added, each task SHALL have a unique identifier.

```javascript
// Property: all task IDs are unique
function property_taskIdsUnique(tasks) {
  const ids = tasks.map(t => t.id);
  const uniqueIds = new Set(ids);
  return ids.length === uniqueIds.size;
}
```

### Property 9: Link ID Uniqueness
**Requirement:** 4.3
**Property:** FOR ALL links added, each link SHALL have a unique identifier.

```javascript
// Property: all link IDs are unique
function property_linkIdsUnique(links) {
  const ids = links.map(l => l.id);
  const uniqueIds = new Set(ids);
  return ids.length === uniqueIds.size;
}
```

## Implementation Notes

### UUID Generation
Use a simple UUID generator for task and link IDs:
```javascript
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
```

### Time Update Interval
Use setInterval with 1000ms delay for time and timer updates. Store interval ID for cleanup.

### Event Delegation
Use event delegation on task list and links container for efficient event handling on dynamic elements.

### Error Handling
- Validate URL format before saving links
- Sanitize task text to prevent XSS
- Handle Local Storage quota exceeded errors gracefully

## Accessibility Implementation

### Semantic HTML Structure

All components use semantic HTML elements for proper document structure:

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header>
    <div id="settings-container">...</div>
  </header>
  <main id="main-content">
    <section id="greeting-section" aria-labelledby="greeting-heading">...</section>
    <section id="timer-section" aria-labelledby="timer-heading">...</section>
    <section id="task-section" aria-labelledby="task-heading">...</section>
    <section id="links-section" aria-labelledby="links-heading">...</section>
  </main>
</body>
```

### ARIA Attributes by Component

#### Greeting Component
- `aria-live="polite"` on greeting container for name changes
- `aria-label` on edit button: "Edit your name"

#### Focus Timer
- `role="timer"` on timer display
- `aria-live="assertive"` on timer completion announcement
- `aria-label` on buttons: "Start timer", "Stop timer", "Reset timer"
- `aria-atomic="true"` on timer display for screen reader updates

#### Task List
- `role="list"` on task list container
- `role="listitem"` on each task item
- `aria-checked="true/false"` on task checkboxes
- `aria-label` on task actions: "Edit task", "Delete task"
- `aria-live="polite"` on task list for additions/removals

#### Quick Links
- `role="navigation"` on links section
- `aria-label` on link buttons: "Open [link name]"
- `aria-label` on delete button: "Delete [link name] link"

#### Theme Toggle
- `aria-pressed="true/false"` to indicate current state
- `aria-label="Toggle dark mode"`

### Keyboard Navigation

All interactive elements are keyboard accessible:
- Tab navigation through all controls
- Enter/Space to activate buttons
- Escape to cancel editing operations
- Visible focus indicators with `:focus-visible` styling

```css
:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}
```

### Color Contrast

Theme colors meet WCAG 2.1 AA standards:
- Light theme: Text #333333 on #ffffff (contrast ratio: 12.6:1)
- Dark theme: Text #eaeaea on #1a1a2e (contrast ratio: 11.5:1)
- Accent colors maintain minimum 4.5:1 contrast ratio

### Visual Indicators Beyond Color

- Task priority: Uses both color and text labels (High, Medium, Low)
- Completed tasks: Strikethrough text in addition to gray color
- Timer state: Icon changes (play/pause) in addition to color
- Focus indicators: Visible outline, not just color change
