# Deployment Checklist ✅

Use this checklist to deploy your PKM Tool:

## Initial Setup

### 1. Create GitHub Repository
- [ ] Go to GitHub.com
- [ ] Click "New Repository"
- [ ] Name: `pkm-tool` (or your preferred name)
- [ ] Visibility: Public
- [ ] Don't initialize with README (we have our own)
- [ ] Click "Create repository"

### 2. Upload Files
You can upload via GitHub web interface or command line:

**Option A - GitHub Web Interface:**
- [ ] Click "uploading an existing file"
- [ ] Drag all files from the `pkm-tool` folder
- [ ] Commit the files

**Option B - Command Line:**
```bash
cd pkm-tool
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pkm-tool.git
git push -u origin main
```

### 3. Enable GitHub Pages
- [ ] Go to repository Settings
- [ ] Click "Pages" in the left sidebar
- [ ] Under "Source", select "main" branch
- [ ] Click "Save"
- [ ] Note the URL: `https://YOUR-USERNAME.github.io/pkm-tool`
- [ ] Wait 2-5 minutes for deployment

### 4. Test the App
- [ ] Visit your GitHub Pages URL
- [ ] App loads correctly
- [ ] Add a test task
- [ ] Refresh page - task is still there
- [ ] Complete the task
- [ ] Check all views (Today, Upcoming, Completed, Settings)

## Slack Integration

### 5. Create Slack App
- [ ] Visit https://api.slack.com/messaging/webhooks
- [ ] Click "Create New App" → "From scratch"
- [ ] App Name: "PKM Daily Tasks"
- [ ] Select your workspace
- [ ] Click "Create App"

### 6. Set Up Incoming Webhook
- [ ] Click "Incoming Webhooks" in sidebar
- [ ] Toggle "Activate Incoming Webhooks" ON
- [ ] Click "Add New Webhook to Workspace"
- [ ] Select channel (e.g., #daily-tasks or #personal)
- [ ] Click "Allow"
- [ ] Copy the Webhook URL (starts with `https://hooks.slack.com/services/`)

### 7. Configure in App
- [ ] Open your PKM Tool
- [ ] Go to Settings
- [ ] Paste Slack Webhook URL
- [ ] Set channel name (optional)
- [ ] Set notification time (default: 18:00)
- [ ] Click "Save Settings"
- [ ] Click "Test Slack" button
- [ ] Verify message appears in Slack channel

## GitHub Actions (Optional but Recommended)

### 8. Set Up Automated Notifications
- [ ] Go to GitHub repository
- [ ] Click Settings → Secrets and variables → Actions
- [ ] Click "New repository secret"
- [ ] Name: `SLACK_WEBHOOK_URL`
- [ ] Value: Paste your Slack webhook URL
- [ ] Click "Add secret"

### 9. Verify GitHub Action
- [ ] Go to "Actions" tab
- [ ] You should see "Daily Slack Notification" workflow
- [ ] Click on it
- [ ] Click "Run workflow" to test manually
- [ ] Check if notification arrives in Slack

### 10. Adjust Timezone (if needed)
- [ ] Edit `.github/workflows/daily-notification.yml`
- [ ] Update the cron schedule for your timezone
- [ ] Commit and push changes

## Customization (Optional)

### 11. Personalize Your Tool
- [ ] Change app name in `index.html`
- [ ] Customize colors in `styles.css`
- [ ] Adjust notification time
- [ ] Add your own logo/branding

## Final Verification

### 12. Complete Test
- [ ] Add 3-4 tasks
- [ ] Complete 1-2 tasks
- [ ] Wait for or manually trigger 6 PM notification
- [ ] Verify Slack message contains:
  - [ ] Completed tasks list
  - [ ] Pending tasks list
  - [ ] Proper formatting
- [ ] Check next day - pending tasks moved to today

### 13. Backup
- [ ] Export your data from Settings
- [ ] Save the JSON file somewhere safe
- [ ] Bookmark your GitHub Pages URL
- [ ] Save your Slack webhook URL securely

## Maintenance

### Regular Tasks:
- [ ] Export data monthly (Settings → Export Data)
- [ ] Check GitHub Actions runs (if any failures)
- [ ] Update Slack webhook if channel changes
- [ ] Review and complete tasks daily!

## Troubleshooting Reference

### If something doesn't work:

**App not loading:**
1. Check GitHub Pages is enabled
2. Verify repository is public
3. Wait 5 minutes after enabling Pages
4. Check browser console (F12) for errors

**Slack not working:**
1. Verify webhook URL is correct
2. Check webhook in Slack settings
3. Use "Test Slack" button
4. Check browser console for errors

**GitHub Actions failing:**
1. Verify secret name is exactly `SLACK_WEBHOOK_URL`
2. Check Actions tab for error logs
3. Ensure webhook is still active
4. Try re-adding the secret

**Tasks not saving:**
1. Check localStorage is enabled in browser
2. Try a different browser
3. Check browser console for errors
4. Clear cache and reload

---

## Success! 🎉

Once all items are checked, your PKM Tool is fully deployed and functional!

**Your App:** https://YOUR-USERNAME.github.io/pkm-tool
**Slack Notifications:** Configured ✓
**Auto-sync:** Every day at 6 PM ✓

Enjoy your new personal task management system!
