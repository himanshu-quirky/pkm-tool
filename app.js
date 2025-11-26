// PKM Tool - Main Application Logic
class PKMTool {
    constructor() {
        this.tasks = this.loadTasks();
        this.settings = this.loadSettings();
        this.currentView = 'today';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTasks();
        this.updateSubtitle();
        this.checkDailyRollover();
        this.setupDailyNotification();
    }

    // Local Storage Management
    loadTasks() {
        const tasks = localStorage.getItem('pkm_tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    saveTasks() {
        localStorage.setItem('pkm_tasks', JSON.stringify(this.tasks));
        this.updateSyncStatus();
    }

    loadSettings() {
        const settings = localStorage.getItem('pkm_settings');
        return settings ? JSON.parse(settings) : {
            slackWebhook: '',
            slackChannel: '',
            notificationTime: '18:00',
            lastNotification: null
        };
    }

    saveSettings() {
        localStorage.setItem('pkm_settings', JSON.stringify(this.settings));
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Task Input
        const taskInput = document.getElementById('task-input');
        const addTaskBtn = document.getElementById('add-task-btn');
        
        addTaskBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Settings
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettingsForm());
        document.getElementById('sync-slack').addEventListener('click', () => this.testSlackNotification());
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        document.getElementById('clear-data').addEventListener('click', () => this.clearData());

        // Load settings into form
        this.loadSettingsForm();
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

        // Update title
        const titles = {
            today: 'Today',
            upcoming: 'Upcoming Tasks',
            completed: 'Completed Tasks',
            settings: 'Settings'
        };
        document.getElementById('view-title').textContent = titles[view];
        this.updateSubtitle();

        // Render appropriate view
        if (view === 'today') {
            this.renderTasks();
        } else if (view === 'upcoming') {
            this.renderUpcomingTasks();
        } else if (view === 'completed') {
            this.renderAllCompletedTasks();
        }
    }

    updateSubtitle() {
        const subtitle = document.getElementById('view-subtitle');
        const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        if (this.currentView === 'today') {
            subtitle.textContent = today;
        } else if (this.currentView === 'upcoming') {
            const upcomingCount = this.tasks.filter(t => !t.completed && t.date !== this.getTodayDate()).length;
            subtitle.textContent = `${upcomingCount} tasks scheduled`;
        } else if (this.currentView === 'completed') {
            const completedCount = this.tasks.filter(t => t.completed).length;
            subtitle.textContent = `${completedCount} tasks completed`;
        } else {
            subtitle.textContent = '';
        }
    }

    // Task Management
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
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        input.value = '';
        input.focus();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateSubtitle();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateSubtitle();
        }
    }

    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Rendering
    renderTasks() {
        const todayDate = this.getTodayDate();
        const todayTasks = this.tasks.filter(t => t.date === todayDate);
        
        const pending = todayTasks.filter(t => !t.completed);
        const completed = todayTasks.filter(t => t.completed);

        this.renderTaskList('pending-tasks', pending);
        this.renderTaskList('completed-tasks', completed);
    }

    renderTaskList(containerId, tasks) {
        const container = document.getElementById(containerId);
        
        if (tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <p>${containerId === 'pending-tasks' ? 'No pending tasks' : 'No completed tasks yet'}</p>
                </div>
            `;
            return;
        }

        container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');

        // Add event listeners
        tasks.forEach(task => {
            const card = container.querySelector(`[data-task-id="${task.id}"]`);
            if (card) {
                card.querySelector('.task-checkbox').addEventListener('click', () => this.toggleTask(task.id));
                card.querySelector('.delete').addEventListener('click', () => this.deleteTask(task.id));
            }
        });
    }

    createTaskCard(task) {
        const time = new Date(task.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return `
            <div class="task-card ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
                <div class="task-content">
                    <div class="task-text">${this.escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="task-date">
                            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                            </svg>
                            ${time}
                        </span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn delete">Delete</button>
                </div>
            </div>
        `;
    }

    renderUpcomingTasks() {
        const todayDate = this.getTodayDate();
        const upcoming = this.tasks.filter(t => !t.completed && t.date !== todayDate);
        
        const container = document.getElementById('upcoming-tasks-list');
        
        if (upcoming.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                    </svg>
                    <h3>No upcoming tasks</h3>
                    <p>All your tasks are scheduled for today</p>
                </div>
            `;
            return;
        }

        // Group by date
        const grouped = {};
        upcoming.forEach(task => {
            if (!grouped[task.date]) grouped[task.date] = [];
            grouped[task.date].push(task);
        });

        container.innerHTML = Object.keys(grouped).sort().map(date => `
            <div class="task-section">
                <h3 class="section-title">${this.formatDate(date)}</h3>
                <div class="task-list">
                    ${grouped[date].map(task => this.createTaskCard(task)).join('')}
                </div>
            </div>
        `).join('');
    }

    renderAllCompletedTasks() {
        const completed = this.tasks.filter(t => t.completed);
        
        const container = document.getElementById('all-completed-tasks');
        
        if (completed.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <h3>No completed tasks</h3>
                    <p>Complete some tasks to see them here</p>
                </div>
            `;
            return;
        }

        // Group by date
        const grouped = {};
        completed.forEach(task => {
            if (!grouped[task.date]) grouped[task.date] = [];
            grouped[task.date].push(task);
        });

        container.innerHTML = Object.keys(grouped).sort().reverse().map(date => `
            <div class="task-section">
                <h3 class="section-title">${this.formatDate(date)}</h3>
                <div class="task-list">
                    ${grouped[date].map(task => this.createTaskCard(task)).join('')}
                </div>
            </div>
        `).join('');
    }

    // Settings
    loadSettingsForm() {
        document.getElementById('slack-webhook').value = this.settings.slackWebhook || '';
        document.getElementById('slack-channel').value = this.settings.slackChannel || '';
        document.getElementById('notification-time').value = this.settings.notificationTime || '18:00';
    }

    saveSettingsForm() {
        this.settings.slackWebhook = document.getElementById('slack-webhook').value.trim();
        this.settings.slackChannel = document.getElementById('slack-channel').value.trim();
        this.settings.notificationTime = document.getElementById('notification-time').value;
        
        this.saveSettings();
        this.setupDailyNotification();
        
        alert('Settings saved successfully!');
    }

    // Slack Integration
    async sendSlackNotification() {
        if (!this.settings.slackWebhook) {
            console.log('No Slack webhook configured');
            return;
        }

        const todayDate = this.getTodayDate();
        const todayTasks = this.tasks.filter(t => t.date === todayDate);
        const completed = todayTasks.filter(t => t.completed);
        const pending = todayTasks.filter(t => !t.completed);

        const message = this.formatSlackMessage(completed, pending);

        try {
            const response = await fetch(this.settings.slackWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            });

            if (response.ok) {
                this.settings.lastNotification = new Date().toISOString();
                this.saveSettings();
                return true;
            } else {
                throw new Error('Slack API error');
            }
        } catch (error) {
            console.error('Failed to send Slack notification:', error);
            return false;
        }
    }

    formatSlackMessage(completed, pending) {
        const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });

        let text = `📋 *Daily Task Summary - ${today}*\n\n`;

        if (completed.length > 0) {
            text += `✅ *Completed Tasks (${completed.length}):*\n`;
            completed.forEach(task => {
                text += `   • ${task.text}\n`;
            });
            text += '\n';
        }

        if (pending.length > 0) {
            text += `⏳ *Pending Tasks (${pending.length}):*\n`;
            pending.forEach(task => {
                text += `   • ${task.text}\n`;
            });
            text += '\n';
            text += `_These tasks will be moved to tomorrow._`;
        } else {
            text += `🎉 *All tasks completed!* Great job today!`;
        }

        const message = {
            text: text,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: `📋 Daily Task Summary - ${today}`,
                        emoji: true
                    }
                },
                {
                    type: "divider"
                }
            ]
        };

        if (completed.length > 0) {
            message.blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*✅ Completed Tasks (${completed.length}):*\n${completed.map(t => `• ${t.text}`).join('\n')}`
                }
            });
        }

        if (pending.length > 0) {
            message.blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*⏳ Pending Tasks (${pending.length}):*\n${pending.map(t => `• ${t.text}`).join('\n')}`
                }
            });
            message.blocks.push({
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: "_These tasks will be moved to tomorrow._"
                    }
                ]
            });
        } else {
            message.blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "🎉 *All tasks completed!* Great job today!"
                }
            });
        }

        if (this.settings.slackChannel) {
            message.channel = this.settings.slackChannel;
        }

        return message;
    }

    async testSlackNotification() {
        if (!this.settings.slackWebhook) {
            alert('Please configure your Slack webhook URL in Settings first.');
            return;
        }

        const button = document.getElementById('sync-slack');
        button.textContent = 'Sending...';
        button.disabled = true;

        const success = await this.sendSlackNotification();
        
        button.textContent = 'Test Slack';
        button.disabled = false;

        if (success) {
            alert('Slack notification sent successfully!');
        } else {
            alert('Failed to send Slack notification. Please check your webhook URL.');
        }
    }

    // Daily Notification
    setupDailyNotification() {
        // Clear existing interval
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
        }

        // Check every minute
        this.notificationInterval = setInterval(() => {
            this.checkNotificationTime();
        }, 60000);

        // Check immediately
        this.checkNotificationTime();
    }

    checkNotificationTime() {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        if (currentTime === this.settings.notificationTime) {
            const today = this.getTodayDate();
            const lastNotificationDate = this.settings.lastNotification ? 
                this.settings.lastNotification.split('T')[0] : null;
            
            // Only send once per day
            if (lastNotificationDate !== today) {
                this.sendSlackNotification();
                this.rolloverPendingTasks();
            }
        }
    }

    // Daily Rollover
    checkDailyRollover() {
        const lastCheck = localStorage.getItem('lastRolloverCheck');
        const today = this.getTodayDate();
        
        if (lastCheck !== today) {
            // It's a new day, but don't rollover yet (wait for 6 PM)
            localStorage.setItem('lastRolloverCheck', today);
        }
    }

    rolloverPendingTasks() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split('T')[0];
        
        const today = this.getTodayDate();
        
        // Move all pending tasks from yesterday to today
        this.tasks.forEach(task => {
            if (!task.completed && task.date === yesterdayDate) {
                task.date = today;
            }
        });
        
        this.saveTasks();
        this.renderTasks();
    }

    // Data Management
    exportData() {
        const data = {
            tasks: this.tasks,
            settings: { ...this.settings, slackWebhook: '' }, // Don't export webhook
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pkm-backup-${this.getTodayDate()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            if (confirm('This will delete all your tasks permanently. Are you absolutely sure?')) {
                localStorage.removeItem('pkm_tasks');
                localStorage.removeItem('pkm_settings');
                this.tasks = [];
                this.settings = {
                    slackWebhook: '',
                    slackChannel: '',
                    notificationTime: '18:00',
                    lastNotification: null
                };
                this.renderTasks();
                this.loadSettingsForm();
                alert('All data has been cleared.');
            }
        }
    }

    // Utilities
    updateSyncStatus() {
        const indicator = document.querySelector('.sync-status span');
        indicator.textContent = 'Saving...';
        setTimeout(() => {
            indicator.textContent = 'All changes saved';
        }, 500);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dateString === this.getTodayDate()) {
            return 'Today';
        } else if (dateString === tomorrow.toISOString().split('T')[0]) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PKMTool();
});
