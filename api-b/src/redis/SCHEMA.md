# Redis Database Schema

Description of all keys and values in use.

`graph:{id}` : `hash`

Information about the specified persisted graph.

```typescript
{
  owner: string
  created_at: string
  version: string
}
```

`graph:{id}:json` : `string`

Stringified json representation of the graph
