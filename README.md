# Expiring OTP Generator

Expiring OTP Generator is a simple Node.js module for generating and managing expiring one-time passwords (OTPs). It provides a straightforward way to generate OTPs, store them with an expiration time, verify OTPs, and automatically clean up expired OTPs.

## Installation

```bash
npm install expiring-otp-generator
```
const otpGenerator = require('expiring-otp-generator');

* Generate and store an OTP:
    ```javascript
    const email = 'example@email.com';
    const expiryTime = 60000; // 1 minute in milliseconds
    const otp = otpGenerator.generateAndStoreOTP(6, email, expiryTime);
    ```

* Verify the OTP:
    ```javascript
    const isVerified = otpGenerator.verifyOTP(otp, email);
    if (isVerified) {
        console.log('OTP verification successful');
    } else {
        console.log('OTP verification failed');
    }
    ```

* Start the cleanup interval:
    ```javascript
    otpGenerator.startCleanupInterval();
    ```

## API

* `generateAndStoreOTP(length: number, email: string, expiryTime?: number): string`
    - Generates an OTP of the specified length, associates it with the provided email, and stores it with an optional expiration time. Returns the generated OTP.
        - `length:` The length of the OTP.
        - `email:` The email to associate with the generated OTP.
        - `expiryTime:` Optional. Expiration time for the OTP in milliseconds. Default is 5 minutes.

* `verifyOTP(otp: string, email: string): boolean`
    - Verifies the provided OTP for the given email. Returns true if the OTP is valid; otherwise, returns false.
        - `otp:` The OTP to verify.
        - `email:` The email associated with the OTP.

* `startCleanupInterval(): void`
    - Starts an automatic cleanup interval to remove expired OTPs. The cleanup interval runs every 60 seconds by default.

## License

This project is licensed under the MIT License.

## Acknowledgments

This module is inspired by the need for a simple and efficient expiring OTP solution. Special thanks to the Node.js community for their valuable contributions and feedback.
