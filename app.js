// Nexus - Your Digital Second Brain
class Nexus {
    constructor() {
        this.data = this.loadData();
        this.currentView = 'home';
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTasks();
        this.setupCalendar();
        this.setupFocus();
        this.setupJournal();
        this.render();
        this.setupAutoSave();
        this.checkDailySlackNotification();
    }

    // Data Management
    loadData() {
        const saved = localStorage.getItem('nexus_data');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            tasks: [
                {
                    id: 1,
                    text: 'Review Q4 project proposals',
                    completed: false,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    text: 'Prepare slides for team meeting',
                    completed: false,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    text: 'Deploy Nexus to GitHub Pages',
                    completed: false,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    text: 'Morning standup with the team',
                    completed: true,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString(),
                    completedAt: new Date().toISOString()
                },
                {
                    id: 5,
                    text: 'Review and respond to emails',
                    completed: true,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString(),
                    completedAt: new Date().toISOString()
                }
            ],
            focus: '',
            journal: {
                good: '',
                bad: '',
                learning: ''
            },
            settings: {
                slackWebhook: '',
                notificationTime: '18:00',
                lastNotification: null
            }
        };
    }

    saveData() {
        localStorage.setItem('nexus_data', JSON.stringify(this.data));
    }

    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Navigation
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === view) {
                item.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`${view}-view`).classList.add('active');

        // Render view-specific content
        if (view === 'home') {
            this.renderHome();
        } else if (view === 'tasks') {
            this.renderTasks();
        } else if (view === 'calendar') {
            this.renderCalendar();
        } else if (view === 'daily') {
            this.renderDaily();
        }
    }

    // Home Dashboard
    renderHome() {
        const todayTasks = this.data.tasks.filter(t => t.date === this.getTodayDate());
        const completed = todayTasks.filter(t => t.completed);
        const pending = todayTasks.filter(t => !t.completed);

        // Update stats
        document.getElementById('tasks-today-count').textContent = todayTasks.length;
        document.getElementById('tasks-completed-count').textContent = completed.length;
        document.getElementById('notes-count').textContent = '12'; // Static for now
        document.getElementById('projects-count').textContent = '3'; // Static for now

        // Render task preview
        const previewContainer = document.getElementById('home-tasks-preview');
        previewContainer.innerHTML = '';
        
        pending.slice(0, 3).forEach(task => {
            previewContainer.appendChild(this.createTaskElement(task));
        });

        if (pending.length === 0) {
            previewContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-tertiary);">All tasks completed! 🎉</div>';
        }
    }

    // Focus Management
    setupFocus() {
        const focusInput = document.getElementById('focus-input');
        if (focusInput) {
            focusInput.value = this.data.focus || '';
            
            focusInput.addEventListener('input', () => {
                this.data.focus = focusInput.value;
                this.saveData();
            });

            focusInput.addEventListener('blur', () => {
                this.saveData();
            });
        }
    }

    // Task Management
    setupTasks() {
        const addBtn = document.getElementById('add-task-btn-main');
        const saveBtn = document.getElementById('save-task-btn');
        const cancelBtn = document.getElementById('cancel-task-btn');
        const input = document.getElementById('new-task-input');
        const container = document.getElementById('task-input-container');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                container.style.display = 'block';
                input.focus();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.addTask());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                container.style.display = 'none';
                input.value = '';
            });
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask();
                }
            });
        }
    }

    addTask() {
        const input = document.getElementById('new-task-input');
        const text = input.value.trim();

        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            date: this.getTodayDate(),
            createdAt: new Date().toISOString()
        };

        this.data.tasks.unshift(task);
        this.saveData();
        this.renderTasks();
        this.renderHome();

        input.value = '';
        document.getElementById('task-input-container').style.display = 'none';
    }

    renderTasks() {
        const todayTasks = this.data.tasks.filter(t => t.date === this.getTodayDate());
        const pending = todayTasks.filter(t => !t.completed);
        const completed = todayTasks.filter(t => t.completed);

        // Render pending
        const pendingContainer = document.getElementById('tasks-list');
        if (pendingContainer) {
            pendingContainer.innerHTML = '';
            pending.forEach(task => {
                pendingContainer.appendChild(this.createTaskElement(task, true));
            });

            if (pending.length === 0) {
                pendingContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-tertiary);">No pending tasks</div>';
            }
        }

        // Render completed
        const completedContainer = document.getElementById('tasks-completed-list');
        if (completedContainer) {
            completedContainer.innerHTML = '';
            completed.forEach(task => {
                completedContainer.appendChild(this.createTaskElement(task, true));
            });

            if (completed.length === 0) {
                completedContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-tertiary);">No completed tasks</div>';
            }
        }
    }

    createTaskElement(task, showActions = false) {
        const item = document.createElement('div');
        item.className = 'task-item' + (task.completed ? ' completed' : '');
        item.dataset.id = task.id;

        const checkbox = document.createElement('div');
        checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
        checkbox.addEventListener('click', () => this.toggleTask(task.id));

        const content = document.createElement('div');
        content.className = 'task-content-text';
        content.textContent = task.text;

        item.appendChild(checkbox);
        item.appendChild(content);

        if (showActions) {
            const actions = document.createElement('div');
            actions.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'task-action-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editTask(task.id);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'task-action-btn delete';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTask(task.id);
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            item.appendChild(actions);
        }

        return item;
    }

    toggleTask(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveData();
            this.renderTasks();
            this.renderHome();
        }
    }

    editTask(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText && newText.trim()) {
                task.text = newText.trim();
                this.saveData();
                this.renderTasks();
                this.renderHome();
            }
        }
    }

    deleteTask(taskId) {
        if (confirm('Delete this task?')) {
            this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
            this.saveData();
            this.renderTasks();
            this.renderHome();
        }
    }

    // Calendar
    setupCalendar() {
        const prevBtn = document.getElementById('cal-prev');
        const nextBtn = document.getElementById('cal-next');
        const todayBtn = document.getElementById('cal-today');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.renderCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.renderCalendar();
            });
        }

        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                this.currentDate = new Date();
                this.renderCalendar();
            });
        }
    }

    renderCalendar() {
        const monthYearEl = document.getElementById('calendar-month-year');
        const daysContainer = document.getElementById('calendar-days');

        if (!monthYearEl || !daysContainer) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        monthYearEl.textContent = new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        daysContainer.innerHTML = '';

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            const dayEl = this.createCalendarDay(day, true);
            daysContainer.appendChild(dayEl);
        }

        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && 
                          month === today.getMonth() && 
                          year === today.getFullYear();
            const dayEl = this.createCalendarDay(day, false, isToday);
            daysContainer.appendChild(dayEl);
        }

        // Next month days
        const totalCells = adjustedFirstDay + daysInMonth;
        const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = this.createCalendarDay(day, true);
            daysContainer.appendChild(dayEl);
        }
    }

    createCalendarDay(day, otherMonth, isToday = false) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        if (otherMonth) dayEl.classList.add('other-month');
        if (isToday) dayEl.classList.add('today');
        dayEl.textContent = day;
        return dayEl;
    }

    // Daily Journal
    setupJournal() {
        const journalDate = this.getTodayDate();
        const savedJournal = localStorage.getItem(`journal_${journalDate}`);
        
        if (savedJournal) {
            this.data.journal = JSON.parse(savedJournal);
        }

        ['good', 'bad', 'learning'].forEach(type => {
            const input = document.getElementById(`journal-${type}`);
            if (input) {
                input.value = this.data.journal[type] || '';
                
                input.addEventListener('input', () => {
                    this.data.journal[type] = input.value;
                    localStorage.setItem(`journal_${journalDate}`, JSON.stringify(this.data.journal));
                });
            }
        });
    }

    renderDaily() {
        const today = new Date();
        const titleEl = document.getElementById('daily-title');
        if (titleEl) {
            titleEl.textContent = '📝 ' + today.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    // Auto-save
    setupAutoSave() {
        setInterval(() => {
            this.saveData();
        }, 30000); // Save every 30 seconds
    }

    // Slack Integration
    checkDailySlackNotification() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        if (currentTime === this.data.settings.notificationTime) {
            const today = this.getTodayDate();
            const lastNotification = this.data.settings.lastNotification;
            
            if (!lastNotification || !lastNotification.startsWith(today)) {
                this.sendSlackNotification();
            }
        }

        // Check every minute
        setTimeout(() => this.checkDailySlackNotification(), 60000);
    }

    async sendSlackNotification() {
        const webhook = this.data.settings.slackWebhook;
        if (!webhook) return;

        const todayTasks = this.data.tasks.filter(t => t.date === this.getTodayDate());
        const completed = todayTasks.filter(t => t.completed);
        const pending = todayTasks.filter(t => !t.completed);

        const message = {
            text: '📋 Daily Summary from Nexus',
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: '🧠 Daily Summary from Nexus'
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*Today's Focus:*\n${this.data.focus || 'No focus set'}`
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*✅ Completed:* ${completed.length} tasks\n*⏳ Pending:* ${pending.length} tasks`
                    }
                }
            ]
        };

        if (completed.length > 0) {
            message.blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '*Completed Tasks:*\n' + completed.map(t => `• ${t.text}`).join('\n')
                }
            });
        }

        if (pending.length > 0) {
            message.blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: '*Pending Tasks:*\n' + pending.map(t => `• ${t.text}`).join('\n')
                }
            });
        }

        try {
            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });

            this.data.settings.lastNotification = new Date().toISOString();
            this.saveData();
        } catch (error) {
            console.error('Failed to send Slack notification:', error);
        }
    }

    // Initial Render
    render() {
        this.renderHome();
        this.renderTasks();
        this.renderCalendar();
        this.renderDaily();
    }
}

// Global function for navigation from HTML
function switchToView(view) {
    if (window.nexus) {
        window.nexus.switchView(view);
    }
}

// Initialize Nexus
document.addEventListener('DOMContentLoaded', () => {
    window.nexus = new Nexus();
});
