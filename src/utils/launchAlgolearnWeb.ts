/**
 * Launches the AlgolearnWeb project in the browser
 * This will attempt to open the project at localhost:3000 (common dev server port)
 */
export const launchAlgolearnWeb = async (): Promise<void> => {
  try {
    const algolearnWebUrl = 'http://localhost:3000';
    
    // First, try to check if the server is running by making a simple request
    try {
      const response = await fetch(algolearnWebUrl, { method: 'HEAD', mode: 'no-cors' });
      // If we get here, server is likely running
      window.open(algolearnWebUrl, '_blank');
      return;
    } catch (fetchError) {
      // Server might not be running, but we'll still try to open the URL
      // The user will see the "site can't be reached" message which includes instructions
    }
    
    // Open the URL regardless - if server isn't running, browser will show helpful error
    window.open(algolearnWebUrl, '_blank');
    
    // Also try to open on alternative port 5173 (Vite default)
    setTimeout(() => {
      window.open('http://localhost:5173', '_blank');
    }, 1000);
    
  } catch (error) {
    console.error('Failed to launch AlgolearnWeb:', error);
    
    // Show error message with manual instructions
    alert(`Failed to launch AlgolearnWeb automatically.\n\nTo run manually:\n1. Open terminal in: D:\\corporate_intranet_hub\\code-flow-dash\\AlgolearnWeb\n2. Run: npm run dev\n3. Open: http://localhost:3000`);
  }
};

/**
 * Browser-compatible version that opens the local development URL
 */
export const openAlgolearnWebBrowser = (): void => {
  const algolearnWebUrl = 'http://localhost:3000';
  
  try {
    window.open(algolearnWebUrl, '_blank');
    console.log('Opening AlgolearnWeb in new tab');
  } catch (error) {
    console.error('Failed to open AlgolearnWeb:', error);
    alert('Failed to open AlgolearnWeb. Please navigate to http://localhost:3000 manually.');
  }
};
