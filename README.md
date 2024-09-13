# Zyapi

This API provides basic information about me, my projects, skills and technologies I have used. It is used in my personal projects, such as https://zyrakia.dev.

## Response Formats

All responses are in JSON format, and standardized to the following formats:

**Success response format**:

```ts
{
	statusCode: number;
	statusMessage: string;
	success: true;
	message: string | undefined;
	value: unknown | undefined;
}
```

**Error response format**:

```ts
{
	statusCode: number;
	statusMessage: string;
	success: false | undefined;
	error: string | undefined;
}
```

## Endpoints

The following list of endpoints may not be 100% accurate, depending on if I have forgotten to update the documentation or not.

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>(gets general information about me)</code></summary>

##### Response Value

```ts
{
	name: string;
	alias: string;
	avatar_url: string;
	bio: string;
	age: number;
	location: string;
	contact: {
		email: string;
		website: string;
		github: string;
		linkedin: string;
		twitter: string;
	}
}
```

</details>
