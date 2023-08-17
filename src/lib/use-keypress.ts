import { useEffect } from "react";

/**
 * Wrapper to attach an event listener on a certain keypress to an custom event.
 * @remark The event listener will be removed automatically when the component is unmounted.
 * @param key The {@link KeyboardEvent.key} string to attach to.
 * @param action The custom action to perform when that key is pressed.
 */
export function useKeyPress(key: string, action: () => void): void {
  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      if (e.key === key) {
        action();
      }
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [action, key]);
}
