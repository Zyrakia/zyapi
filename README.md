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

The following list of endpoints which are automatically generated.

<details>
<summary><code>get</code> <code><b>/hue</b></code> - Returns whether Hue control support is enabled on this server.</summary>

</details>

<details>
<summary><code>get</code> <code><b>/</b></code> - Redirects to the primary user profile (my own profile).</summary>

</details>

<details>
<summary><code>get</code> <code><b>/projects</b></code> - Returns all entered projects.</summary>

### Properties

| Type  | Name             | Description                                                                                        |
| ----- | ---------------- | -------------------------------------------------------------------------------------------------- |
| query | using_technology | when specified, returns only the projects that use the technology associated with the specified ID |

### Response Schema

```ts
Array<{
	id: number;
	name: string;
	description: null | string;
	url: null | string;
	start_date: null | string;
	end_date: null | string;
	logo_url: null | string;
	technologies_referenced: number;
}> |
	Array<{
		id: number;
		name: string;
		description: null | string;
		url: null | string;
		start_date: null | string;
		end_date: null | string;
	}>;
```

</details>

<details>
<summary><code>get</code> <code><b>/projects/[id]</b></code> - Returns information about a project by the ID of the project.</summary>

### Properties

| Type  | Name         | Description                                             |
| ----- | ------------ | ------------------------------------------------------- |
| query | technologies | whether to include the technologies used by the project |

### Response Schema

```ts
undefined | {
  description: null | string;
  id: number;
  name: string;
  url: null | string;
  start_date: null | string;
  end_date: null | string;
  logo_url: null | string;
} | {
  technologies: Array<
    {
      id: number;
      name: string;
      url: null | string;
      logo_url: null | string;
      skill_level: null | number;
      category: null | string;
    }
  >;
  description: null | string;
  id: number;
  name: string;
  url: null | string;
  start_date: null | string;
  end_date: null | string;
  logo_url: null | string;
}
```

</details>

<details>
<summary><code>get</code> <code><b>/status</b></code> - Always responds if the API is available, providing the version of the API.</summary>

### Response Schema

```ts
{
	version: string;
}
```

</details>

<details>
<summary><code>get</code> <code><b>/tech</b></code> - Returns information about a technology by its ID.</summary>

### Properties

| Type  | Name           | Description |
| ----- | -------------- | ----------- |
| query | project_filter |             |

### Response Schema

```ts
Array<{
	id: number;
	name: string;
	url: null | string;
	logo_url: null | string;
	skill_level: null | number;
	category: null | string;
}> |
	Array<{
		id: number;
		name: string;
		url: null | string;
		logo_url: null | string;
		skill_level: null | number;
		category: null | string;
		projects_referenced: number;
	}>;
```

</details>

<details>
<summary><code>get</code> <code><b>/tech/[id]</b></code> - Returns information about a technology by its ID.</summary>

### Properties

| Type  | Name          | Description                                                    |
| ----- | ------------- | -------------------------------------------------------------- |
| query | with_projects | whether to include the projects that the technology is used in |

### Response Schema

```ts
undefined | {
  id: number;
  name: string;
  url: null | string;
  logo_url: null | string;
  skill_level: null | number;
  category: null | string;
} | {
  projects: Array<
    {
      id: number;
      name: string;
      description: null | string;
      url: null | string;
      start_date: null | string;
      end_date: null | string;
    }
  >;
  id: number;
  name: string;
  url: null | string;
  logo_url: null | string;
  skill_level: null | number;
  category: null | string;
}
```

</details>

<details>
<summary><code>get</code> <code><b>/user/[id]</b></code> - Returns a user profile for the specified user ID.</summary>

### Response Schema

```ts
{
  name?: string;
  alias?: string;
  avatar_url?: string;
  bio?: string;
  age?: number;
  location?: string;
  contact: {
    website?: string;
  } & {
    [index: string]: undefined | string;
  };
}
```

</details>
