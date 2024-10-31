// This code is for use with Postman to request today’s data for a specified inverter (ID: 12233344445555).
// It sets up headers and authentication, calculates necessary parameters, and stores them as environment variables for easy reuse in the main request.

// HTTP request
// POST {{apiUrl}}
// Headers
// Content-Type: application/json
// Authorization: {{Authorization}}
// Content-MD5: {{Content-MD5}}
// Date: {{Date}}
// Body
// {{requestBody}}

// Pre-request Script
// Define credentials and API details
const keyId = "1234567890"; // API KeyId
const keySecret = "1a2b3c4d5e6f"; // Secret key associated with Key ID
const baseUrl = "https://www.soliscloud.com:13333"; // Base URL for SolisCloud API
const path = "/v1/api/inverterDay"; // Specific endpoint for daily inverter data
const currency = "GBP"; // Currency for the power plant; modify as needed
const dateStr = "2024-10-31"; // Date to request data for, in YYYY-MM-DD format
const timeZone = 0; // Time zone offset; use 0 for GMT, adjust for UK summer time if needed

// Convert date to timestamp format if required by API
const dateTimestamp = new Date(dateStr).getTime(); // Converts date string to Unix timestamp

// Prepare request body with required fields
const requestBody = {
    sn: "12233344445555", // Inverter serial number; only provide one of 'sn' or 'id'
    money: currency,
    time: dateStr, // Date in string format, YYYY-MM-DD
    timeZone: timeZone // Time zone offset
};

// Convert request body to JSON string for MD5 hashing
const requestBodyStr = JSON.stringify(requestBody);

// Calculate Content-MD5 for body integrity verification
const md5Hash = CryptoJS.MD5(requestBodyStr);
const contentMd5 = CryptoJS.enc.Base64.stringify(md5Hash);

// Generate Date header in GMT format (required for authorization)
const gmtDate = new Date().toUTCString();

// Create string for HMAC-SHA1 signing (for Authorization header)
const paramString = `POST\n${contentMd5}\napplication/json\n${gmtDate}\n${path}`;

// Perform HMAC-SHA1 signing to authenticate the request
const hmacSha1 = CryptoJS.HmacSHA1(paramString, keySecret);
const signature = CryptoJS.enc.Base64.stringify(hmacSha1);

// Store URL and headers as environment variables for use in the main request
pm.environment.set("apiUrl", `${baseUrl}${path}`);
pm.environment.set("Content-MD5", contentMd5);
pm.environment.set("Date", gmtDate);
pm.environment.set("Authorization", `API ${keyId}:${signature}`);
pm.environment.set("requestBody", requestBodyStr); // Store JSON string for use in request body

// Expected Response
// Upon a successful request, expect a 200 OK response with a structure like:
// {
//    "success": true,
//    "code": "0",
//    "msg": "success",
//    "data": [
//        {today's data}
//    ]
// }
