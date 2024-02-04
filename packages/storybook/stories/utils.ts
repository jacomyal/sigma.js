export function onStoryDown(cleanFn: () => void) {
  const storyRoot = document.getElementById("storybook-root");
  if (storyRoot) {
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver((_records, observer) => {
      cleanFn();
      observer.disconnect();
    });
    // Start observing the target node for configured mutations
    observer.observe(storyRoot, { childList: true });
  }
}
