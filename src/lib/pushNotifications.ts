const BACKEND_URL = "https://fastapi-backend-nt2a.onrender.com";

export interface PushSubscription {
	endpoint: string;
	keys: {
		p256dh: string;
	};
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
			});
			console.log("Service Worker registered:", registration);
			return registration;
		} catch (error) {
			console.error("Service Worker registration failed:", error);
			return null;
		}
	}
	return null;
}

export async function subscribeToPushNotifications(
	registration: ServiceWorkerRegistration,
): Promise<PushSubscription | null> {
	try {
		const vapidKey = urlBase64ToUint8Array(
			// This is a public VAPID key - in production, you should get this from your backend
			process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
				"BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fC3K99nkD4t7kBZYQXBPJE9aOH-mUkpnqP3rW6zqNBPTBuUQWlQk",
		);

		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: vapidKey as BufferSource,
		});

		const subscriptionJSON =
			subscription.toJSON() as unknown as PushSubscription;

		// Send subscription to backend
		const response = await fetch(`${BACKEND_URL}/subscribe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				endpoint: subscriptionJSON.endpoint,
				keys: {
					p256dh: subscriptionJSON.keys?.p256dh,
					// Deliberately omitting auth
				},
			}),
		});

		if (!response.ok) {
			throw new Error("Failed to subscribe to push notifications");
		}

		console.log("Successfully subscribed to push notifications");
		return subscriptionJSON;
	} catch (error) {
		console.error("Failed to subscribe to push notifications:", error);
		return null;
	}
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
	if ("Notification" in window) {
		return await Notification.requestPermission();
	}
	return "denied";
}

export async function sendTestNotification(message: string): Promise<boolean> {
	try {
		const response = await fetch(
			`${BACKEND_URL}/notify?message=${encodeURIComponent(message)}`,
			{
				method: "POST",
			},
		);

		if (!response.ok) {
			throw new Error("Failed to send notification");
		}

		console.log("Test notification sent successfully");
		return true;
	} catch (error) {
		console.error("Failed to send test notification:", error);
		return false;
	}
}

// Helper function to convert base64 string to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
