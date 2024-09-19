<details>
<summary><code>get</code> <code><b>/</b></code> - Always responds if the API is available, providing the version of the API.</summary>

### Properties

| Type  | Name                 | Description                                               |
| ----- | -------------------- | --------------------------------------------------------- |
| query | include_technologies | whether to include the technologies used to build the API |

### Response Schema

```ts
{
  version: string;
}
```

</details>
