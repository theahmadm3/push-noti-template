const BACKEND_URL = "https://fastapi-backend-nt2a.onrender.com";

export interface PushSubscription {
	endpoint: string;
	keys: {
		p256dh: string;
		auth?: string;
	};
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("/sw.js", {
				scope: "/",
			});

			// Wait for the service worker to be ready
			await navigator.serviceWorker.ready;

			console.log("Service Worker registered and ready:", registration);
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
		// Check if already subscribed
		const existingSubscription =
			await registration.pushManager.getSubscription();
		if (existingSubscription) {
			console.log("Already subscribed, unsubscribing first...");
			await existingSubscription.unsubscribe();
		}

		const vapidKey = urlBase64ToUint8Array(
			process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
				"BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8-fC3K99nkD4t7kBZYQXBPJE9aOH-mUkpnqP3rW6zqNBPTBuUQWlQk",
		);

		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: vapidKey,
		});

		const subscriptionJSON = subscription.toJSON();

		console.log("Subscription created:", subscriptionJSON);

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
					// auth: subscriptionJSON.keys?.auth,
				},
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Backend subscription failed:", errorText);
			throw new Error(
				`Failed to subscribe to push notifications: ${response.status}`,
			);
		}

		const result = await response.json();
		console.log("Successfully subscribed to push notifications:", result);

		return subscriptionJSON as unknown as PushSubscription;
	} catch (error) {
		console.error("Failed to subscribe to push notifications:", error);
		if (error instanceof Error) {
			console.error("Error details:", error.message, error.stack);
		}
		return null;
	}
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
	if ("Notification" in window) {
		const permission = await Notification.requestPermission();
		console.log("Notification permission:", permission);
		return permission;
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
			const errorText = await response.text();
			console.error("Failed to send notification:", errorText);
			throw new Error(`Failed to send notification: ${response.status}`);
		}

		console.log("Test notification sent successfully");
		return true;
	} catch (error) {
		console.error("Failed to send test notification:", error);
		return false;
	}
}

// Helper function to convert base64 string to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, "+")
		.replace(/_/g, "/");

	const rawData = window.atob(base64);
	const buffer = new ArrayBuffer(rawData.length);
	const outputArray = new Uint8Array(buffer);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}
