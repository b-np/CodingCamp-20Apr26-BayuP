// Todo Life Dashboard - Main Application
// All components in a single file as per requirements

(function () {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  // Generate UUID for tasks and links
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  // Sanitize text to prevent XSS
  function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // LOCAL STORAGE KEYS
  // ============================================

  const STORAGE_KEYS = {
    USERNAME: 'dashboard_username',
    TASKS: 'dashboard_tasks',
    QUICK_LINKS: 'dashboard_links',
    THEME: 'dashboard_theme',
    TIMER_DURATION: 'dashboard_timer_duration',
  };

  // ============================================
  // GREETING COMPONENT
  // ============================================

  let greetingElements = null;

  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    greetingElements.timeDisplay.textContent = `${hours}:${minutes}`;
  }

  function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    greetingElements.dateDisplay.textContent = now.toLocaleDateString('en-US', options);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 11) return 'Good Morning';
    if (hour >= 12 && hour <= 16) return 'Good Afternoon';
    if (hour >= 17 && hour <= 20) return 'Good Evening';
    return 'Good Night';
  }

  function updateGreeting() {
    greetingElements.greetingText.textContent = getGreeting() + ',';
  }

  function loadName() {
    const savedName = localStorage.getItem(STORAGE_KEYS.USERNAME);
    if (savedName) {
      greetingElements.greetingName.textContent = savedName;
    }
  }

  function saveName(name) {
    localStorage.setItem(STORAGE_KEYS.USERNAME, name);
    greetingElements.greetingName.textContent = name;
  }

  function editName() {
    greetingElements.edit.nameInput.value = greetingElements.greetingName.textContent;

    greetingElements.editNameButton.classList.add('hidden');
    greetingElements.greetingName.classList.add('hidden');
    greetingElements.edit.container.classList.remove('hidden');
    greetingElements.edit.nameInput.focus();
    greetingElements.edit.nameInput.select();
  }

  function finishNameEdit() {
    const newName = greetingElements.edit.nameInput.value.trim();
    if (newName) {
      saveName(newName);
    }
    greetingElements.edit.container.classList.add('hidden');
    greetingElements.greetingName.classList.remove('hidden');
    greetingElements.editNameButton.classList.remove('hidden');
  }

  function cancelNameEdit() {
    greetingElements.edit.container.classList.add('hidden');
    greetingElements.greetingName.classList.remove('hidden');
    greetingElements.editNameButton.classList.remove('hidden');
  }

  function initGreeting() {
    // Initialize elements after DOM is ready
    greetingElements = {
      timeDisplay: document.getElementById('time-display'),
      dateDisplay: document.getElementById('date-display'),
      greetingText: document.getElementById('greeting-text'),
      greetingName: document.getElementById('greeting-name'),
      editNameButton: document.getElementById('edit-name-button'),
      edit: {
        container: document.getElementById('greeting-edit-container'),
        nameInput: document.getElementById('greeting-edit-name-input'),
        saveButton: document.getElementById('greeting-edit-save-button'),
        cancelButton: document.getElementById('greeting-edit-cancel-button'),
      },
    };

    updateTime();
    updateDate();
    updateGreeting();
    loadName();

    setInterval(updateTime, 1000);

    setInterval(() => {
      updateDate();
      updateGreeting();
    }, 60000);

    // Event listeners
    greetingElements.editNameButton.addEventListener('click', editName);
    greetingElements.edit.saveButton.addEventListener('click', finishNameEdit);
    greetingElements.edit.cancelButton.addEventListener('click', cancelNameEdit);
    greetingElements.edit.nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishNameEdit();
      } else if (e.key === 'Escape') {
        cancelNameEdit();
      }
    });
  }

  // ============================================
  // FOCUS TIMER COMPONENT
  // ============================================

  let timerElements = null;

  const DEFAULT_TIMER_DURATION = 25 * 60; // 25 minutes in seconds
  let timerDuration = DEFAULT_TIMER_DURATION;
  let timerState = {
    timeRemaining: DEFAULT_TIMER_DURATION,
    isRunning: false,
    isEditing: false,
    intervalId: null
  };

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    timerElements.display.timer.textContent = formatTime(timerState.timeRemaining);
  }

  function loadTimerDuration() {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMER_DURATION);
    if (saved) {
      const duration = parseInt(saved, 10);
      if (!isNaN(duration) && duration > 0) {
        timerDuration = duration;
        timerState.timeRemaining = duration;
      }
    }
  }

  function saveTimerDuration(duration) {
    localStorage.setItem(STORAGE_KEYS.TIMER_DURATION, duration.toString());
    timerDuration = duration;
  }

  function enterEditMode() {
    if (timerState.isRunning) return;

    timerState.isEditing = true;
    const mins = Math.floor(timerDuration / 60);
    const secs = timerDuration % 60;

    timerElements.display.edit.minutesInput.value = mins;
    timerElements.display.edit.secondsInput.value = String(secs).padStart(2, '0');

    timerElements.display.timer.classList.add('hidden');
    timerElements.display.edit.container.classList.remove('hidden');
    timerElements.editControls.editButton.classList.add('hidden');
    timerElements.editControls.saveButton.classList.remove('hidden');
    timerElements.editControls.cancelButton.classList.remove('hidden');

    timerElements.display.edit.minutesInput.focus();
    timerElements.display.edit.minutesInput.select();
  }

  function exitEditMode(save = false) {
    if (save) {
      const mins = parseInt(timerElements.display.edit.minutesInput.value, 10) || 0;
      const secs = parseInt(timerElements.display.edit.secondsInput.value, 10) || 0;
      const totalSeconds = Math.max(1, mins * 60 + secs);

      saveTimerDuration(totalSeconds);
      timerState.timeRemaining = totalSeconds;
      updateTimerDisplay();
    }

    timerState.isEditing = false;
    timerElements.display.timer.classList.remove('hidden');
    timerElements.display.edit.container.classList.add('hidden');
    timerElements.editControls.editButton.classList.remove('hidden');
    timerElements.editControls.saveButton.classList.add('hidden');
    timerElements.editControls.cancelButton.classList.add('hidden');
  }

  function playTimerNotification() {
    // Try to play audio file first
    const audio = new Audio('audio/notification.mp3');

    audio.play().catch(() => {
      try {
        playNotificationThroughBrowser();
      } catch (e) {
        console.warn('Audio notification not available');
      }
    });
  }

  function playNotificationThroughBrowser() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Resume audio context if suspended (required by browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function announceTimerComplete() {
    const mins = Math.floor(timerDuration / 60);
    timerElements.announcement.textContent = `Timer complete! ${mins} minute focus session ended.`;
    setTimeout(() => {
      timerElements.announcement.textContent = '';
    }, 3000);
  }

  function startTimer() {
    if (timerState.isRunning || timerState.isEditing) return;

    timerState.isRunning = true;
    timerElements.controls.startButton.disabled = true;
    timerElements.editControls.editButton.disabled = true;

    timerState.intervalId = setInterval(() => {
      timerState.timeRemaining--;
      updateTimerDisplay();

      if (timerState.timeRemaining <= 0) {
        stopTimer();
        resetTimer();
        playTimerNotification();
        announceTimerComplete();
      }
    }, 1000);
  }

  function stopTimer() {
    if (!timerState.isRunning) return;

    timerState.isRunning = false;
    timerElements.controls.startButton.disabled = false;
    timerElements.editControls.editButton.disabled = false;

    if (timerState.intervalId) {
      clearInterval(timerState.intervalId);
      timerState.intervalId = null;
    }
  }

  function resetTimer() {
    stopTimer();
    timerState.timeRemaining = timerDuration;
    updateTimerDisplay();
  }

  function initTimer() {
    // Initialize elements after DOM is ready
    timerElements = {
      display: {
        container: document.getElementById('timer-display-container'),
        timer: document.getElementById('timer-display'),
        edit: {
          container: document.getElementById('timer-display-edit'),
          minutesInput: document.getElementById('timer-minutes-input'),
          secondsInput: document.getElementById('timer-seconds-input'),
        },
      },

      editControls: {
        container: document.getElementById('timer-edit-controls'),
        editButton: document.getElementById('timer-edit-button'),
        saveButton: document.getElementById('timer-save-button'),
        cancelButton: document.getElementById('timer-cancel-button'),
      },
      
      controls: {
        container: document.getElementById('timer-controls'),
        startButton: document.getElementById('timer-start-button'),
        stopButton: document.getElementById('timer-stop-button'),
        resetButton: document.getElementById('timer-reset-button'),
      },

      announcement: document.getElementById('timer-announcement')
    };

    loadTimerDuration();
    updateTimerDisplay();

    timerElements.controls.startButton.addEventListener('click', startTimer);
    timerElements.controls.stopButton.addEventListener('click', stopTimer);
    timerElements.controls.resetButton.addEventListener('click', resetTimer);
    timerElements.editControls.editButton.addEventListener('click', enterEditMode);
    timerElements.editControls.saveButton.addEventListener('click', () => exitEditMode(true));
    timerElements.editControls.cancelButton.addEventListener('click', () => exitEditMode(false));

    timerElements.display.edit.minutesInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        exitEditMode(true);
      } else if (e.key === 'Escape') {
        exitEditMode(false);
      }
    });
    timerElements.display.edit.secondsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        exitEditMode(true);
      } else if (e.key === 'Escape') {
        exitEditMode(false);
      }
    });
  }

  // ============================================
  // TASK LIST COMPONENT
  // ============================================

  let taskElements = null;
  let tasks = [];

  function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        tasks = JSON.parse(saved);
      } catch (e) {
        tasks = [];
      }
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  function addTask(text, priority = null) {
    const sanitizedText = sanitizeText(text);
    const isDuplicate = tasks.some(
      task => task.text.toLowerCase() === sanitizedText.toLowerCase()
    );

    if (isDuplicate) {
      alert("The task has a duplicate of the same name!");
      return;
    }

    const task = {
      id: generateId(),
      text: sanitizedText,
      completed: false,
      priority: priority || null,
      createdAt: Date.now()
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    announceTask('Task added: ' + text);
  }

  function editTask(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.text = sanitizeText(newText);
      saveTasks();
      renderTasks();
    }
  }

  function toggleTaskComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      announceTask(task.completed ? 'Task completed' : 'Task uncompleted');
    }
  }

  function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      announceTask('Task deleted');
    }
  }

  function sortTasks(criteria) {
    const sorted = [...tasks];
    switch (criteria) {
      case 'alphabetical':
        sorted.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2, null: 3 };
        sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'default':
      default:
        sorted.sort((a, b) => a.createdAt - b.createdAt);
    }
    return sorted;
  }

  function announceTask(message) {
    taskElements.announcement.textContent = message;
    setTimeout(() => {
      taskElements.announcement.textContent = '';
    }, 2000);
  }

  function renderTasks() {
    const taskTemplate = (task) =>
    `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" role="listitem">
        <input type="checkbox" class="task-checkbox" 
               ${task.completed ? 'checked' : ''} 
               aria-checked="${task.completed}"
               aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
        <span class="task-text">${task.text}</span>
        ${task.priority ? `<span class="task-priority ${task.priority}">${task.priority}</span>` : ''}
        <button class="edit-task-button" aria-label="Edit task">Edit</button>
        <button class="delete-task-button" aria-label="Delete task">Delete</button>
      </li>
    `;

    const criteria = taskElements.sortSelect.value;
    const sorted = sortTasks(criteria);

    taskElements.list.innerHTML = sorted.map(task => taskTemplate(task)).join('');
  }

  function handleTaskListClick(e) {
    const taskItem = e.target.closest('.task-item');
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;

    if (e.target.classList.contains('task-checkbox')) {
      toggleTaskComplete(taskId);
    } else if (e.target.classList.contains('edit-task-button')) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const textSpan = taskItem.querySelector('.task-text');
        const currentText = task.text;

        // Replace text with input
        textSpan.innerHTML = `<input type="text" class="task-text-input" value="${currentText}" aria-label="Edit task text">`;
        const input = textSpan.querySelector('input');
        input.focus();
        input.select();

        const finishEdit = () => {
          const newText = input.value.trim();
          if (newText && newText !== currentText) {
            editTask(taskId, newText);
          } else {
            renderTasks();
          }
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            finishEdit();
          } else if (e.key === 'Escape') {
            renderTasks();
          }
        });
      }
    } else if (e.target.classList.contains('delete-task-button')) {
      deleteTask(taskId);
    }
  }

  function handleAddTask() {
    const text = taskElements.input.value.trim();
    if (!text) return;

    const priority = taskElements.priority.value || null;

    addTask(text, priority);

    taskElements.input.value = '';
    taskElements.priority.value = '';
    taskElements.input.focus();
  }

  function initTasks() {
    taskElements = {
      input: document.getElementById('task-input'),
      priority: document.getElementById('task-priority'),
      addButton: document.getElementById('add-task-button'),
      sortSelect: document.getElementById('sort-select'),
      list: document.getElementById('task-list'),
      announcement: document.getElementById('task-announcement')
    };

    loadTasks();
    renderTasks();

    taskElements.addButton.addEventListener('click', handleAddTask);
    taskElements.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAddTask();
      }
    });
    taskElements.sortSelect.addEventListener('change', renderTasks);
    taskElements.list.addEventListener('click', handleTaskListClick);
  }

  // ============================================
  // QUICK LINKS COMPONENT
  // ============================================

  let quickLinkElements = null;
  let quickLinks = [];

  function loadQuickLinks() {
    const saved = localStorage.getItem(STORAGE_KEYS.QUICK_LINKS);
    if (saved) {
      try {
        quickLinks = JSON.parse(saved);
      } catch (e) {
        quickLinks = [];
      }
    }
  }

  function saveQuickLinks() {
    localStorage.setItem(STORAGE_KEYS.QUICK_LINKS, JSON.stringify(quickLinks));
  }

  // TODO: http:// currently doesn't work.
  function formatQuickLinkUrl(url) {
    let trimmedUrl = url.trim();
    if (!/^https?:\/\//i.test(trimmedUrl)) trimmedUrl = `https://${trimmedUrl}`;
    try {
      const result = new URL(trimmedUrl);
      return result.href;
    } catch {
      return null;
    }
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  function addQuickLink(name, url) {
    url = formatQuickLinkUrl(url);
    if (!isValidUrl(url)) {
      alert('Please enter a valid URL (e.g., example.com, https://example.com)');
      return false;
    }

    const quickLink = {
      id: generateId(),
      name: sanitizeText(name),
      url: url
    };
    quickLinks.push(quickLink);
    saveQuickLinks();
    renderQuickLinks();
    return true;
  }

  function deleteQuickLink(id) {
    const index = quickLinks.findIndex(l => l.id === id);
    if (index !== -1) {
      quickLinks.splice(index, 1);
      saveQuickLinks();
      renderQuickLinks();
    }
  }

  function renderQuickLinks() {
    const linkTemplate = (link) => 
    `
      <div class="quick-link-item" data-id="${link.id}">
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${link.name}">${link.name}</a>
        <button class="delete-quick-link-button" aria-label="Delete ${link.name} link">×</button>
      </div>
    `;

    quickLinkElements.container.innerHTML = quickLinks.map(link => linkTemplate(link)).join('');
  }

  function handleQuickLinksClick(e) {
    if (e.target.classList.contains('delete-quick-link-button')) {
      const linkItem = e.target.closest('.quick-link-item');
      if (linkItem) {
        deleteQuickLink(linkItem.dataset.id);
      }
    }
  }

  function handleAddQuickLink() {
    const name = quickLinkElements.labelInput.value.trim();
    const url = quickLinkElements.urlInput.value.trim();

    if (!name || !url) {
      alert('Please enter both a name and URL');
      return;
    }

    if (addQuickLink(name, url)) {
      quickLinkElements.labelInput.value = '';
      quickLinkElements.urlInput.value = '';
      quickLinkElements.labelInput.focus();
    }
  }

  function initQuickLinks() {
    // Initialize elements after DOM is ready
    quickLinkElements = {
      labelInput: document.getElementById('quick-link-label'),
      urlInput: document.getElementById('quick-link-url'),
      addButton: document.getElementById('add-quick-link-button'),
      container: document.getElementById('quick-links-container')
    };

    loadQuickLinks();
    renderQuickLinks();

    quickLinkElements.addButton.addEventListener('click', handleAddQuickLink);
    quickLinkElements.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleAddQuickLink();
      }
    });
    quickLinkElements.labelInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        quickLinkElements.urlInput.focus();
      }
    });
    quickLinkElements.container.addEventListener('click', handleQuickLinksClick);
  }

  // ============================================
  // THEME TOGGLE COMPONENT
  // ============================================

  let themeElements = null;

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeElements.icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeElements.toggle.setAttribute('aria-pressed', theme === 'dark');
  }

  function loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || getSystemTheme();
  }

  function saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    saveTheme(newTheme);
  }

  function initTheme() {
    // Initialize elements after DOM is ready
    themeElements = {
      toggle: document.getElementById('theme-toggle'),
      icon: document.querySelector('.theme-icon')
    };

    const theme = loadTheme();
    applyTheme(theme);

    themeElements.toggle.addEventListener('click', toggleTheme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    initTheme();
    initGreeting();
    initTimer();
    initTasks();
    initQuickLinks();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
