// Function to generate a random password
if (!window.injectedPasswordScript) {
    window.injectedPasswordScript = true;

    function generatePassword(length) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    }
    
    passwords = generatePassword(12);
    // Function to download password as a text file
    function downloadPassword() {
        const password = passwords; // Generate a 12-character password
        const websiteName = document.location.hostname;
    
        // Generate filename with format: {sitename}_{date}_pass.txt
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
        const filename = `${websiteName}_${currentDate}_pass.txt`;
    
        // Create text content for the file
        const fileContent = `------------------\n> Website: ${websiteName}\n> Password: ${password}\n------------------`;
    
        // Create a Blob containing the file content
        const blob = new Blob([fileContent], { type: "text/plain" });
    
        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);
    
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
    
        // Trigger the download
        link.click();
    
        // Clean up resources
        URL.revokeObjectURL(url);
    }
    
    function injectPassword(inputField) {
        if (confirm("Do you want a recomendation of your password?")) {
            inputField.value = passwords;
            setTimeout(function () {
                if (confirm("Will You Download The Password, in case you forgot your password?"))  {
                    downloadPassword();
                }
            }, 500)
        }
    }

    const injectedFields = new Set();
    // Inject password into input field when the document is loaded

    function handleFocus(event) {
        const target = event.target;
        if (target && target.type === 'password' && !injectedFields.has(target)) {
            // Inject password into the focused password input field
            injectPassword(target);
            injectedFields.add(target);

            
        }
    }

    document.body.addEventListener('focus', handleFocus, true);
    
    // Trigger download when the content script is executed
    


}

