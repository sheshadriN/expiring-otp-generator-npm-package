const fs = require('fs');
const path = require('path');

const OTP_STORAGE_FILE = path.join(__dirname, 'otpStorage.json');

let otpStorage = loadOTPStorage();

function loadOTPStorage() {
    try {
        if (fs.existsSync(OTP_STORAGE_FILE)) {
            const storedData = JSON.parse(fs.readFileSync(OTP_STORAGE_FILE, 'utf8'));
            return new Map(storedData) || new Map();
        } else {
            // File doesn't exist, return a new Map
            return new Map();
        }
    } catch (error) {
        console.error('Error loading OTP storage:', error);
        return new Map();
    }
}

function saveOTPStorage(storage) {
    try {
        if (storage instanceof Map) {
            fs.writeFileSync(OTP_STORAGE_FILE, JSON.stringify([...storage])); // Convert Map to array before saving
        } else {
            throw new Error('Invalid storage format. Expected a Map. Received: ' + typeof storage);
        }
    } catch (error) {
        console.error('Error saving OTP storage:', error);
    }
}

function generateOTP(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generateAndStoreOTP(length, email, expiryTime) {
    if (otpStorage.size >= 1000) {
        throw new Error('Maximum OTP storage limit reached. Unable to generate and store new OTP.');
    }

    const otp = generateOTP(length);
    const otpExpiryTime = expiryTime || 300000; // 5 minutes in milliseconds
    const expiryTimestamp = Date.now() + otpExpiryTime;
    otpStorage.set(otp, { email, expiryTime: expiryTimestamp });

    console.log(`OTP ${otp} generated for email ${email}. Expires at ${new Date(expiryTimestamp)}`);

    saveOTPStorage(otpStorage);

    return otp;
}

function verifyOTP(otp, email) {
    const otpData = otpStorage.get(otp);
    if (!otpData || otpData.expiryTime < Date.now() || otpData.email !== email) {
        otpStorage.delete(otp);
        console.error(`Verification failed for OTP ${otp} and email ${email}`);
        return false;
    }
    console.log(`Verification successful for OTP ${otp} and email ${email}`);
    return true;
}

function startCleanupInterval() {
    setInterval(() => {
        const currentTime = Date.now();
        otpStorage.forEach((value, key) => {
            if (value.expiryTime < currentTime) {
                otpStorage.delete(key);
                console.log(`Expired OTP ${key} removed from storage`);
            }
        });

        saveOTPStorage(otpStorage);
    }, 60000);
}

module.exports = {
    generateAndStoreOTP,
    verifyOTP,
    startCleanupInterval,
};
