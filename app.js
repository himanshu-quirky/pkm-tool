// Cortex - Your Digital Second Brain
class Cortex {
    constructor() {
        this.data = this.loadData();
        this.currentView = 'daily';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTaskHandlers();
        this.setupNoteHandlers();
        this.renderDailyView();
        this.updateDate();
        this.loadDailyFocus();
        this.setupAutoSave();
    }

    // Data Management
    loadData() {
        const saved = localStorage.getItem('cortex_data');
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
                    createdAt: new Date().toISOString(),
                    priority: 'high'
                },
                {
                    id: 2,
                    text: 'Prepare slides for team meeting',
                    completed: false,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString(),
                    priority: 'medium'
                },
                {
                    id: 3,
                    text: 'Deploy PKM tool to GitHub Pages',
                    completed: false,
                    date: this.getTodayDate(),
                    createdAt: new Date().toISOString(),
                    priority: 'high'
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
            notes: [],
            focus: '',
            settings: {
                slackWebhook: '',
                notificationTime: '18:00'
            }
        };
    }

    saveData() {
        localStorage.setItem('cortex_data', JSON.stringify(this.data));
    }

    // Navigation
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                this.switchView(view);
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) {
                link.classList.add('active');
            }
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`${view}-view`).classList.add('active');

        // Render appropriate content
        if (view === 'daily') {
            this.renderDailyView();
        } else if (view === 'tasks') {
            this.renderAllTasks();
        }
    }

    // Date Management
    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    updateDate() {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('daily-date').textContent = today.toLocaleDateString('en-US', options);
    }

    // Daily View
    renderDailyView() {
        const todayTasks = this.data.tasks.filter(t => t.date === this.getTodayDate());
        const pending = todayTasks.filter(t => !t.completed);
        const completed = todayTasks.filter(t => t.completed);

        this.renderTaskList('today-tasks', pending, completed);
        this.updateStats(pending.length, completed.length);
    }

    renderTaskList(containerId, pending, completed) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Render pending tasks
        pending.forEach(task => {
            container.appendChild(this.createTaskElement(task));
        });

        // Render completed tasks
        completed.forEach(task => {
            container.appendChild(this.createTaskElement(task));
        });

        if (pending.length === 0 && completed.length === 0) {
            container.innerHTML = '<div style="color: var(--text-tertiary); text-align: center; padding: var(--space-6);">No tasks yet. Add one to get started!</div>';
        }
    }

    createTaskElement(task) {
        const item = document.createElement('div');
        item.className = 'task-item' + (task.completed ? ' completed' : '');
        item.dataset.id = task.id;

        const time = new Date(task.createdAt).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit'
        });

        item.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
            <div class="task-content">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-meta">${time}</span>
            </div>
        `;

        // Add event listeners
        const checkbox = item.querySelector('.task-checkbox');
        checkbox.addEventListener('click', () => this.toggleTask(task.id));

        return item;
    }

    updateStats(pending, completed) {
        const stats = document.querySelectorAll('.stat-value');
        if (stats.length >= 3) {
            stats[0].textContent = completed;
            stats[1].textContent = this.data.notes.length || 2;
            stats[2].textContent = 5; // Ideas count - can be dynamic
        }
    }

    // All Tasks View
    renderAllTasks() {
        const container = document.getElementById('all-tasks-today');
        if (!container) return;

        const todayTasks = this.data.tasks.filter(t => t.date === this.getTodayDate());
        container.innerHTML = '';

        todayTasks.forEach(task => {
            container.appendChild(this.createTaskElement(task));
        });

        if (todayTasks.length === 0) {
            container.innerHTML = '<div style="color: var(--text-tertiary); text-align: center; padding: var(--space-6);">No tasks for today</div>';
        }
    }

    // Task Handlers
    setupTaskHandlers() {
        const addBtn = document.getElementById('add-task-btn');
        const saveBtn = document.getElementById('save-task-btn');
        const taskInput = document.getElementById('task-input');
        const inputRow = document.getElementById('task-input-row');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                inputRow.style.display = 'flex';
                taskInput.focus();
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.addTask());
        }

        if (taskInput) {
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask();
                }
            });
        }
    }

    addTask() {
        const input = document.getElementById('task-input');
        const text = input.value.trim();

        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            date: this.getTodayDate(),
            createdAt: new Date().toISOString(),
            priority: 'medium'
        };

        this.data.tasks.unshift(task);
        this.saveData();
        this.renderDailyView();

        input.value = '';
        document.getElementById('task-input-row').style.display = 'none';
    }

    toggleTask(taskId) {
        const task = this.data.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveData();
            this.renderDailyView();
            
            // Show celebration for completion
            if (task.completed) {
                this.showNotification('Task completed! 🎉');
            }
        }
    }

    deleteTask(taskId) {
        this.data.tasks = this.data.tasks.filter(t => t.id !== taskId);
        this.saveData();
        this.renderDailyView();
    }

    // Daily Focus
    loadDailyFocus() {
        const focusInput = document.getElementById('daily-focus');
        if (focusInput) {
            focusInput.value = this.data.focus || '';
            
            focusInput.addEventListener('input', () => {
                this.data.focus = focusInput.value;
                this.saveData();
            });
        }
    }

    // Note Handlers
    setupNoteHandlers() {
        const noteEditor = document.getElementById('quick-notes');
        if (noteEditor) {
            // Load saved notes
            const savedNote = localStorage.getItem('cortex_quick_note');
            if (savedNote) {
                noteEditor.textContent = savedNote;
            }

            // Auto-save
            noteEditor.addEventListener('input', () => {
                localStorage.setItem('cortex_quick_note', noteEditor.textContent);
            });
        }

        // New note button
        const newNoteBtn = document.getElementById('new-note-btn');
        if (newNoteBtn) {
            newNoteBtn.addEventListener('click', () => {
                this.createNewNote();
            });
        }
    }

    createNewNote() {
        this.showNotification('Note creation coming soon! 📝');
    }

    // Auto-save
    setupAutoSave() {
        // Save every 30 seconds
        setInterval(() => {
            this.saveData();
        }, 30000);
    }

    // Notifications
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: linear-gradient(135deg, var(--purple-500), var(--indigo-500));
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: slideInUp 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Slack Integration (from previous version)
    async sendSlackNotification() {
        const webhook = this.data.settings.slackWebhook;
        if (!webhook) return;

        const todayTasks = this.data.tasks.filter(t => t.date === this.getTodayDate());
        const completed = todayTasks.filter(t => t.completed);
        const pending = todayTasks.filter(t => !t.completed);

        const message = {
            text: `📋 Daily Summary from Cortex`,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🧠 Daily Summary from Cortex"
                    }
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: `*✅ Completed:* ${completed.length}\n*⏳ Pending:* ${pending.length}`
                    }
                }
            ]
        };

        if (this.data.focus) {
            message.blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Today's Focus:*\n${this.data.focus}`
                }
            });
        }

        try {
            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    // Utilities
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize Cortex
document.addEventListener('DOMContentLoaded', () => {
    window.cortex = new Cortex();
});
