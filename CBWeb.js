/**
 * CalmBridge Onboarding JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("CalmBridge Onboarding initialized.");
});

function selectRole(role, action) {
    // Currently logs the selected role and action
    // We will expand this to transition to Step 1
    console.log(`User selected ${role} and chose to ${action}`);
    
    if (action === 'register') {
        alert(`Starting ${role} registration flow...`);
        // Next phase: Show Step 1 based on role
    } else {
        alert(`Redirecting to ${role} login...`);
        // Typically would redirect to /login
    }
}
