# My PKM Tool 📋

A beautiful, personal knowledge management tool for daily task tracking with automatic Slack integration. Built with vanilla JavaScript and inspired by Capacities' clean design.

![PKM Tool](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- **Beautiful UI** - Modern, clean interface inspired by Capacities
- **Daily Task Management** - Add, complete, and organize your daily tasks
- **Automatic Slack Notifications** - Get daily summaries at 6:00 PM
- **Task Rollover** - Pending tasks automatically move to tomorrow
- **Multiple Views** - Today, Upcoming, Completed, and Settings
- **Data Export** - Export your tasks as JSON backup
- **100% Free** - Runs on GitHub Pages, no server costs
- **Offline-First** - All data stored locally in your browser

## 🚀 Quick Start

### 1. Fork and Deploy

1. **Fork this repository** to your GitHub account
2. Go to **Settings** → **Pages**
3. Under "Source", select **main branch**
4. Save and wait a few minutes
5. Your app will be live at `https://yourusername.github.io/pkm-tool`

### 2. Set Up Slack Integration

#### Create a Slack Webhook:
1. Go to [Slack API: Incoming Webhooks](https://api.slack.com/messaging/webhooks)
2. Click "Create New App" → "From scratch"
3. Name your app (e.g., "PKM Tool") and select your workspace
4. Click "Incoming Webhooks" → Toggle ON
5. Click "Add New Webhook to Workspace"
6. Select the channel for notifications
7. Copy the webhook URL (it looks like `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX`)

#### Configure in the App:
1. Open your PKM Tool
2. Go to **Settings**
3. Paste your Slack Webhook URL
4. Set your preferred notification time (default: 6:00 PM)
5. Click "Save Settings"
6. Test it with the "Test Slack" button

### 3. Set Up Automated Notifications (Optional)

For automated daily notifications at 6 PM via GitHub Actions:

1. Go to your repository **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Name: `SLACK_WEBHOOK_URL`
4. Value: Your Slack webhook URL
5. Click "Add secret"

The GitHub Action will now automatically:
- Run every day at 6:00 PM (adjustable in `.github/workflows/daily-notification.yml`)
- Send a reminder to check your tasks
- You can also trigger it manually from the "Actions" tab

**Note:** The app itself sends notifications from your browser when you have it open. GitHub Actions provides a backup reminder even when the app is closed.

## 📖 How to Use

### Adding Tasks
1. Type your task in the input field
2. Press Enter or click "Add Task"
3. Your task appears in the "In Progress" section

### Completing Tasks
- Click the checkbox next to any task
- Completed tasks move to "Completed Today" section
- They're tracked for your daily summary

### Daily Workflow
1. **Morning**: Check your tasks (yesterday's pending tasks are now today's)
2. **Throughout the day**: Add and complete tasks
3. **6:00 PM**: Automatic Slack notification with:
   - ✅ Completed tasks
   - ⏳ Pending tasks (these will move to tomorrow)

### Views
- **Today**: Your tasks for today
- **Upcoming**: Tasks scheduled for future dates
- **Completed**: All your completed tasks, organized by date
- **Settings**: Configure Slack integration and manage data

## 🎨 Customization

### Change Notification Time
1. Go to Settings
2. Adjust "Daily Notification Time"
3. Save Settings

### Adjust GitHub Actions Schedule
Edit `.github/workflows/daily-notification.yml`:

```yaml
on:
  schedule:
    # Current: 6:00 PM IST (12:30 PM UTC)
    # Format: 'minute hour * * *'
    - cron: '30 12 * * *'
```

Use [crontab.guru](https://crontab.guru) to calculate your timezone's cron expression.

### Customize Colors
Edit `styles.css` and modify CSS variables:

```css
:root {
    --primary-color: #6366f1;  /* Main accent color */
    --secondary-color: #8b5cf6; /* Secondary accent */
    --background: #fafafa;      /* Background color */
    /* ... more variables */
}
```

## 💾 Data Storage

- All data is stored in your browser's `localStorage`
- No data is sent to any server (except Slack notifications)
- Export your data anytime from Settings
- Clear data option available (with confirmation)

## 🔧 Technical Details

### Built With
- Pure HTML5, CSS3, JavaScript (ES6+)
- No frameworks or dependencies
- Responsive design
- Modern browser APIs

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with localStorage support

### File Structure
```
pkm-tool/
├── index.html              # Main HTML structure
├── styles.css              # Capacities-inspired styling
├── app.js                  # Application logic
├── .github/
│   └── workflows/
│       └── daily-notification.yml  # GitHub Actions workflow
└── README.md               # This file
```

## 🔐 Privacy & Security

- **Local-First**: All tasks stored in your browser
- **No Analytics**: No tracking or analytics
- **No Backend**: No server, no database
- **Open Source**: Fully transparent code
- **Slack Webhook**: Only you can access your webhook URL

## 🐛 Troubleshooting

### Slack notifications not working?
- Verify your webhook URL is correct
- Check if the webhook is active in Slack
- Ensure you have the app open at 6:00 PM (for browser-based notifications)
- For GitHub Actions, check the Actions tab for errors

### Tasks not saving?
- Make sure your browser allows localStorage
- Check browser console for errors (F12)
- Try a different browser

### GitHub Pages not working?
- Wait 5-10 minutes after enabling
- Ensure the repository is public
- Check Settings → Pages for the URL

## 📝 License

MIT License - Feel free to modify and use as you wish!

## 🤝 Contributing

This is a personal tool, but feel free to:
- Fork and customize for your needs
- Report bugs via GitHub Issues
- Suggest features
- Share improvements

## 💡 Tips

1. **Use descriptive task names** for better Slack summaries
2. **Review your tasks** each morning
3. **Export data regularly** as backup
4. **Customize the notification time** to fit your schedule
5. **Keep the tab open** near 6 PM for browser notifications

## 🎯 Future Ideas

Some ideas for enhancement (feel free to implement):
- Dark mode toggle
- Task priorities/tags
- Recurring tasks
- Time tracking
- Calendar integration
- Mobile app (PWA)
- Multi-device sync (with backend)

---

**Enjoy your new PKM tool!** 🚀

If you find this useful, consider starring the repository ⭐
