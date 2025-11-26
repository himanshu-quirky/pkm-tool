# Quick Setup Guide

Follow these steps to get your PKM Tool running:

## Step 1: Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload all the files from this folder
3. Go to Settings → Pages
4. Select "main" branch as source
5. Wait 2-3 minutes for deployment
6. Visit `https://your-username.github.io/your-repo-name`

## Step 2: Create Slack Webhook

1. Visit https://api.slack.com/messaging/webhooks
2. Click "Create New App"
3. Choose "From scratch"
4. Name: "My PKM Tool"
5. Select your workspace
6. Click "Incoming Webhooks" in the sidebar
7. Toggle "Activate Incoming Webhooks" to ON
8. Click "Add New Webhook to Workspace"
9. Choose the channel where you want notifications
10. Copy the Webhook URL

## Step 3: Configure the App

1. Open your deployed PKM Tool
2. Click "Settings" in the sidebar
3. Paste your Slack Webhook URL
4. Optionally set a channel name
5. Set notification time (default is 6:00 PM)
6. Click "Save Settings"
7. Click "Test Slack" to verify it works

## Step 4: Set Up GitHub Actions (Optional)

This ensures you get notifications even when the app is closed:

1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `SLACK_WEBHOOK_URL`
5. Value: Paste your Slack webhook URL
6. Click "Add secret"

The action will run automatically every day at 6:00 PM!

## Step 5: Adjust Timezone (If Needed)

The default time is set for IST (GMT+5:30). To change:

### For Browser Notifications:
- Just set your preferred time in Settings

### For GitHub Actions:
Edit `.github/workflows/daily-notification.yml`:

```yaml
- cron: '30 12 * * *'  # Currently 6:00 PM IST (12:30 PM UTC)
```

Calculate your timezone:
- Find your UTC offset
- Convert your desired time to UTC
- Update the cron expression

Example for different timezones:
- **EST (6:00 PM)**: `'0 23 * * *'` (11:00 PM UTC)
- **PST (6:00 PM)**: `'2 2 * * *'` (2:00 AM next day UTC)
- **CET (6:00 PM)**: `'0 17 * * *'` (5:00 PM UTC)

## Verification Checklist

- [ ] App is accessible at GitHub Pages URL
- [ ] Can add and complete tasks
- [ ] Tasks are saved after page refresh
- [ ] Slack test notification works
- [ ] Settings are saved properly
- [ ] GitHub Actions secret is configured (optional)

## Troubleshooting

**App not loading?**
- Check GitHub Pages is enabled
- Ensure repository is public
- Wait a few minutes after enabling

**Slack not working?**
- Verify webhook URL is correct
- Check webhook hasn't been revoked in Slack
- Test with the "Test Slack" button

**GitHub Actions failing?**
- Check if secret name matches exactly: `SLACK_WEBHOOK_URL`
- View logs in Actions tab for error details
- Ensure webhook URL is still valid

## Need Help?

Check the main README.md for detailed documentation and troubleshooting tips.
