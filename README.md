# FatStars

A simple, mobile-first service rating page for your restaurant. Customers tap 1-5 stars:

- **5 stars** - They're prompted to leave a Google review
- **Below 5 stars** - They're asked what went wrong, and the feedback is emailed to you

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open `http://localhost:3000` on your phone or browser.

## Configuration

All configuration is done through environment variables (see `.env.example`):

| Variable | Description |
|---|---|
| `BUSINESS_NAME` | Your business name (shown on the page) |
| `GOOGLE_REVIEW_URL` | Your Google review link |
| `OWNER_EMAIL` | Where feedback emails are sent |
| `SMTP_HOST` | SMTP server (default: `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (default: `587`) |
| `SMTP_USER` | SMTP username (your email) |
| `SMTP_PASS` | SMTP password (use an App Password for Gmail) |

### Finding your Google Review URL

1. Search for your business on [Google Maps](https://maps.google.com)
2. Click your business listing
3. Look for the Place ID, then use: `https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID`

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create a new app password and use it as `SMTP_PASS`

## Usage

Print a QR code linking to your hosted page and place it at the counter. Customers scan, rate, and you get feedback directly.
