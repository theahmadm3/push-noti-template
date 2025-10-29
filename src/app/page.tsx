import PushNotificationManager from "@/components/PushNotificationManager";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans p-4">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Push Notification Template
          </h1>
          <p className="text-lg text-gray-600">
            Next.js + TypeScript + PWA + Push Notifications
          </p>
        </div>
        
        <PushNotificationManager />
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Built with Next.js 16, TypeScript, and PWA support</p>
        </div>
      </main>
    </div>
  );
}
