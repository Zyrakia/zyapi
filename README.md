# Zyapi

This API provides basic information about me, my projects, skills and technologies I have used. It is used in my personal projects, such as https://zyrakia.dev.

## Response Formats

All responses are in JSON format, and standardized to the following formats:

**Success response**:

```json
{
    "statusCode": number;
    "statusMessage": string;
    "success": true;
    "message": string | undefined;
    "value": unknown | undefined;
}
```

**Error response**:

```json
{
    "statusCode": number;
    "statusMessage": string;
    "success": false;
    "error": string;
}
```

## Endpoints

The following list of endpoints may not be 100% accurate, but is updated regularly.

-   `GET /` - returns general information about me.
-   `GET /projects` - returns a list of my favorite projects or projects that I am currently working on or have recently worked on.
