import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildClientSchema, getIntrospectionQuery, printSchema } from 'graphql';

const schemaUrl = process.env.GRAPHQL_SCHEMA_URL ?? 'http://localhost:5000/graphql';

const response = await fetch(schemaUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
});

if (!response.ok) {
    throw new Error(`Unable to fetch the GraphQL schema from ${schemaUrl}: ${response.status}`);
}

const result = await response.json();

if (result.errors?.length || !result.data) {
    throw new Error(
        `GraphQL schema introspection failed: ${result.errors?.map(({ message }) => message).join(', ') ?? 'no schema returned'}`,
    );
}

await writeFile(resolve('schema.gql'), `${printSchema(buildClientSchema(result.data))}\n`);
