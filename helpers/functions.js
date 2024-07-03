// Check if the password has at least 8 characters, one uppercase letter, one lowercase letter, and one number
export function checkPasswordFormat(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
}

// Check if the email is valid
export function checkEmailFormat(email) {
    
    if (!email) return false; // Return false if the email is empty

    if(email.includes(' ')) return false; // Return false if the email contains a space

    if(email.length < 5) return false; // Return false if the email is too short

    // Check if the email contains an @ and contains a dot after the @
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/;

    return emailRegex.test(email);
}

// Check if the username is valid
export function checkUsernameFormat(username) {
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    return usernameRegex.test(username);
}

// Check if a UUID format is valid
export function checkUUIDFormat(uuid) {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    return uuidRegex.test(uuid);
}