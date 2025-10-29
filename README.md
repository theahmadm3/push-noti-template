# Push Notification Template

A Next.js Progressive Web App (PWA) with TypeScript and push notification support.

## Features

- 🚀 Next.js 16 with TypeScript
- 📱 Progressive Web App (PWA) functionality
- 🔔 Push Notifications support
- 💅 Tailwind CSS for styling
- ⚡ Fast and optimized build

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A modern browser that supports push notifications (Chrome, Firefox, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/theahmadm3/push-noti-template.git
cd push-noti-template
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To build the application for production:

```bash
npm run build -- --webpack
npm start
```

Note: The `--webpack` flag is required because the next-pwa plugin uses webpack.

## Push Notification Setup

### Backend API

This application integrates with a FastAPI backend for push notifications:

**Base URL:** `https://fastapi-backend-nt2a.onrender.com`

**Endpoints:**

1. **Subscribe to notifications**
   - **Endpoint:** `POST /subscribe`
   - **Payload:**
   ```json
   {
     "endpoint": "string",
     "keys": {
       "p256dh": "string",
       "auth": "string"
     }
   }
   ```

2. **Send a notification**
   - **Endpoint:** `GET /notify?message=string`
   - **Example:** `/notify?message=Hello%20World`

### How to Use

1. **Enable Notifications:**
   - Click the "Enable Push Notifications" button
   - Grant permission when prompted by your browser
   - The app will automatically subscribe to push notifications

2. **Send Test Notification:**
   - After enabling notifications, enter a test message
   - Click "Send Test Notification"
   - You should receive a push notification

3. **PWA Installation:**
   - The app can be installed as a PWA on supported devices
   - Look for the install prompt in your browser

## Project Structure

```
push-noti-template/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Custom service worker for push notifications
│   └── icon-*.png            # PWA icons
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with PWA metadata
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   └── PushNotificationManager.tsx  # Push notification UI component
│   └── lib/
│       └── pushNotifications.ts         # Push notification utilities
├── next.config.ts            # Next.js configuration with PWA
└── package.json
```

## Environment Variables

You can optionally set a VAPID public key:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

If not set, a default key will be used.

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **next-pwa** - PWA functionality
- **Web Push API** - Push notifications

## Browser Support

Push notifications are supported in:
- Chrome/Edge (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (Desktop & Mobile - iOS 16.4+)

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
