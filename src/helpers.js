/**
 * Fires a key press to be caught by listening components
 */
export function triggerKeyEvent(eventName, keyCode, keyValue = undefined) {
	const event = new window.KeyboardEvent(eventName, { keyCode, key: keyValue });
	document.dispatchEvent(event);
}