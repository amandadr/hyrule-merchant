## Development

This project requires Node >=22.12.0 (see `engines` in `package.json`). An `.nvmrc` pins the major version, so run `nvm use` before dev/build if your shell defaults to an older Node.

`astro` is a project-local dependency, not a global command — a bare `astro …` will fail with `command not found`. Run it through `npm run` (or `npx astro …`), which resolves `node_modules/.bin`.

When starting the dev server, use background mode:

```
npm run dev:bg
```

Manage the background server with `npm run dev:stop`, `npm run dev:status`, and `npm run dev:logs` (each maps to the matching `astro dev …` subcommand).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
