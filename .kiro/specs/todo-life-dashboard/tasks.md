# Implementation Tasks

## Phase 1: Project Setup

- [x] 1.1 Create project folder structure (css/, js/, audio/ directories)
- [x] 1.2 Create index.html with basic HTML5 structure
- [x] 1.3 Create css/styles.css with CSS reset and CSS variables for themes
- [x] 1.4 Create js/app.js with initialization structure
- [x] 1.5 Add audio notification file to audio/ directory

## Phase 2: Greeting Component

- [x] 2.1 Create HTML structure for greeting section (time, date, greeting/name)
- [x] 2.2 Implement updateTime() function to display current time
- [x] 2.3 Implement updateDate() function to display current date
- [x] 2.4 Implement getGreeting() function with time-based logic
- [x] 2.5 Implement name editing with dedicated edit button
- [x] 2.6 Implement name persistence to Local Storage
- [x] 2.7 Add CSS styles for greeting component

## Phase 3: Focus Timer Component

- [x] 3.1 Create HTML structure for timer section (display, controls)
- [x] 3.2 Implement formatTime() function for MM:SS display
- [x] 3.3 Implement startTimer() function with setInterval
- [x] 3.4 Implement stopTimer() function to pause countdown
- [x] 3.5 Implement resetTimer() function to reset to 25:00
- [x] 3.6 Implement audio notification playback on timer complete
- [x] 3.7 Add CSS styles for timer component

## Phase 4: Task List Component

- [x] 4.1 Create HTML structure for task section (input, sort, list)
- [x] 4.2 Implement task data model with id, text, completed, deadline, priority, createdAt
- [x] 4.3 Implement addTask() function with optional deadline and priority
- [x] 4.4 Implement renderTasks() function to display task list
- [x] 4.5 Implement toggleTaskComplete() function
- [x] 4.6 Implement editTask() function
- [x] 4.7 Implement deleteTask() function
- [x] 4.8 Implement sortTasks() function for all sort criteria
- [x] 4.9 Implement task persistence to Local Storage
- [x] 4.10 Add CSS styles for task component (including strikethrough for completed)

## Phase 5: Quick Links Component

- [x] 5.1 Create HTML structure for links section (form, grid container)
- [x] 5.2 Implement link data model with id, name, url
- [x] 5.3 Implement addLink() function with URL validation
- [x] 5.4 Implement renderLinks() function to display link grid
- [x] 5.5 Implement deleteLink() function
- [x] 5.6 Implement link persistence to Local Storage
- [x] 5.7 Add CSS styles for links component (grid layout)

## Phase 6: Theme Toggle Component

- [x] 6.1 Create HTML structure for settings container and theme toggle button
- [x] 6.2 Implement getSystemTheme() function using prefers-color-scheme
- [x] 6.3 Implement toggleTheme() function
- [x] 6.4 Implement applyTheme() function to update document theme
- [x] 6.5 Implement theme persistence to Local Storage
- [x] 6.6 Add CSS variables and styles for light and dark themes

## Phase 7: Integration and Polish

- [x] 7.1 Implement data loading on page initialization
- [x] 7.2 Add responsive CSS for different screen sizes
- [ ] 7.3 Test all components together
- [ ] 7.4 Test Local Storage persistence across page reloads
- [ ] 7.5 Test in multiple browsers (Chrome, Firefox, Edge, Safari)
- [ ] 7.6 Optimize performance and load time

## Phase 8: Accessibility Implementation

- [x] 8.1 Add semantic HTML structure (header, main, section, nav elements)
- [x] 8.2 Add ARIA roles and labels to all interactive components
- [x] 8.3 Implement keyboard navigation with visible focus indicators
- [x] 8.4 Add ARIA live regions for timer updates and completion announcements
- [x] 8.5 Add aria-pressed attribute to theme toggle button
- [x] 8.6 Add aria-checked attribute to task checkboxes
- [x] 8.7 Ensure color contrast meets WCAG 2.1 AA standards
- [x] 8.8 Add visual indicators beyond color for task priority and status
- [x] 8.9 Implement skip link for bypassing repetitive content
- [ ] 8.10 Test with keyboard-only navigation
- [ ] 8.11 Test with screen reader (NVDA, JAWS, or VoiceOver)

## Phase 9: Property-Based Testing

- [ ] 9.1 Write property test for task round-trip persistence
- [ ] 9.2 Write property test for task sort order invariants
- [ ] 9.3 Write property test for timer display format
- [ ] 9.4 Write property test for links round-trip persistence
- [ ] 9.5 Write property test for theme round-trip persistence
- [ ] 9.6 Write property test for name round-trip persistence
- [ ] 9.7 Write property test for greeting time-based logic
- [ ] 9.8 Write property test for task ID uniqueness
- [ ] 9.9 Write property test for link ID uniqueness
