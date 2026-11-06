# Security

## Reporting a vulnerability

Email **hello@designme.agency** with "Security" in the subject. Please don't open a public issue, pull request or
discussion for a vulnerability.

Tell us:

- what is affected: a component, the `designme` CLI, the registry under `https://designme.dev/r`, or the site
- how to reproduce it
- what an attacker could do with it

We'll reply to say we've got it, keep you posted while we fix it, and credit you when the fix is out if you'd like.

## What's covered

- The components, in HTML, React and Astro, as the CLI and the shadcn registry install them
- The `designme` npm package (`packages/designme`)
- The registry files under `r/` and the site at https://designme.dev

We fix the latest version only. The CLI copies source into your project, so to pick up a fix, add the component again
with `--force` (this replaces your own changes to its files).
