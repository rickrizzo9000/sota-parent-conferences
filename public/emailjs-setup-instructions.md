# Schedule Sharing Options

This application provides multiple ways to share your conference schedule:

## 1. Email Simulation

The "Send Email" button in the application simulates sending an email. In a production environment, this would be connected to a real email service like:

- EmailJS
- SendGrid
- AWS SES
- Mailchimp

## 2. Download as Text File

You can download your schedule as a text file by clicking the "Download" button. This creates a file with all your conference details that you can:

- Save for your records
- Print for reference
- Forward via your own email client

## 3. Copy to Clipboard

The "Copy Text" button copies your entire schedule to your clipboard, allowing you to:

- Paste it into an email
- Share via messaging apps
- Add to your calendar notes
- Save in a document

## For Developers

To implement actual email sending in a production environment:

1. Sign up for an email service provider
2. Update the `sendEmail` function in `src/services/emailService.ts` with your provider's API
3. Add proper error handling and rate limiting
4. Consider adding email templates for better formatting

Remember to follow email best practices and comply with privacy regulations when implementing a real email solution.