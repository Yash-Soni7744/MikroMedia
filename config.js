// Configuration file for MikroMedia Website
// This file stores configuration for NoCodeAPI and other settings

const CONFIG = {
    // NoCodeAPI Google Sheets Integration
    // Get your endpoint from: https://nocodeapi.com/
    // Instructions in .env.example file
    nocodeapi: {
        // Your NoCodeAPI endpoint (without tabId)
        apiUrl: 'https://v1.nocodeapi.com/yash7744/google_sheets/LxhEmxBVnsQsBVzh',
        // The name of the tab in your Google Sheet (e.g., 'Sheet1', 'Leads')
        tabId: 'Sheet1',
        // Set to true when you've configured your NoCodeAPI endpoint
        enabled: true
    },

    // Contact form settings
    contactForm: {
        successMessage: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
        errorMessage: 'Oops! An error occurred and your message could not be sent. Please try again.',
        requiredFields: ['name', 'email', 'message']
    },

    // Website information
    site: {
        email: 'contact@mikromedia.dev',
        address: 'Sco-233 HUDA market sector 65 Faridabad'
    }
};

// Make CONFIG available globally
window.APP_CONFIG = CONFIG;

