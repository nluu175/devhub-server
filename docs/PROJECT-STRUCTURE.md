# Project Structure

```text
src/
├── config/          # Configuration and setup files
│   └── apollo.ts    # Apollo Server configuration
│
├── data/           # Data layer (database models, mock data)
│   └── books.ts    # Sample data or database models
│
├── middleware/     # Express and Apollo middleware
│   └── context.ts  # GraphQL context creation
│
├── resolvers/      # GraphQL resolvers
│   └── bookResolvers.ts
│
├── routes/         # Express REST routes
│   └── api.ts
│
├── schema/         # GraphQL schema definitions
│   └── typeDefs.ts
│
├── types/          # TypeScript type definitions
│   └── index.ts
│
└── index.ts        # Application entry point
```

## Resolvers

```text
// src/resolvers/
├── books/
│   ├── mutations.ts
│   ├── queries.ts
│   ├── types.ts         # Field resolvers
│   └── index.ts         # Exports all book resolvers
├── users/
│   ├── mutations.ts
│   ├── queries.ts
│   ├── types.ts
│   └── index.ts
└── index.ts             # Combines all resolvers
```
