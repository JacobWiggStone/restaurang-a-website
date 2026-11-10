# Restaurang Å

A Swedish-language website for Restaurang Å at Åkersberga Golfklubb. Built with Next.js, React and TypeScript, with Sanity for editable restaurant content and Resend for enquiry emails.

![Restaurant setting at Restaurang Å](public/images/restaurang-a/hero.jpg)

## Website features

- Homepage with restaurant information, photography and upcoming events.
- Weekly lunch menus and evening / After Golf menus.
- Dedicated catering, conference and event pages.
- Enquiry form for bookings, private celebrations, weddings and other requests.
- Embedded Sanity Studio for maintaining menus, events, images and site settings.
- Page metadata, social sharing information, sitemap and robots configuration.

## Technology

| Area | Technology |
| --- | --- |
| Website | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4 and custom CSS |
| Content management | Sanity Studio 5 and next-sanity |
| Email | Resend, through a server-side API route |
| Typography | Cormorant Garamond and Manrope through `next/font` |

Exact dependency versions are recorded in `package-lock.json`.

## Run locally

Use Node.js 22.12 or newer within the Node.js 22 release line, with npm. The project was checked with Node.js 22.23.2.

```bash
npm ci
cp .env.example .env.local
```

If `.env.local` already exists, keep it and edit it instead of overwriting it. Fill in the configuration values below, then start the website:

```bash
npm run dev
```

Open `http://localhost:3000`. The content editor is at `http://localhost:3000/studio` and requires access to the configured Sanity project.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project identifier; required to load the site and Studio. |
| `NEXT_PUBLIC_SANITY_DATASET` | Existing Sanity dataset name; required. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional API date; the code defaults to `2026-08-23`. |
| `RESEND_API_KEY` | Private server-side credential for enquiry emails. Never prefix this with `NEXT_PUBLIC_`. |

Use the existing restaurant's configuration when maintaining this site. The `.env.example` file contains placeholders only. Actual credentials belong in `.env.local` and the hosting provider's environment settings, never in Git.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/lunch` | Weekly lunch menu |
| `/kvallsmeny` | Evening / After Golf menu |
| `/catering` | Catering information |
| `/konferens` | Conference information |
| `/event` | Events |
| `/forfragan` | Enquiry form |
| `/studio` | Sanity content editor |
| `/api/forfragan` | Server-side enquiry endpoint (`POST`) |

## Project structure

```text
app/                      Pages, shared components, styles and enquiry API
public/images/restaurang-a/ Local restaurant photographs
sanity/schemaTypes/       Content definitions for menus, events and settings
sanity/lib/               Sanity client and image helpers
sanity.config.ts          Embedded Studio configuration
sanity.cli.ts             Sanity CLI configuration
.env.example              Configuration template without credentials
```

The repository contains application code, content schemas and local assets. Published menu data, Sanity-hosted images, events, users and permissions live in Sanity and are **not** backed up by committing this repository. A separate Sanity dataset export is needed for a content backup.

## Development checks

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm start
```

`npm start` runs a previously built production server. See [project status](docs/PROJECT_STATUS.md) for the actual verification results and existing issues. A successful build alone does not verify email delivery or published content.

## Hosting and configuration

This application needs a Next.js-compatible server; it is not a static GitHub Pages site. Uploading the repository to GitHub stores the source code and does not make the restaurant website live.

For a deployment, configure the same environment variables on the host, install with `npm ci`, and build with `npm run build`. Confirm Sanity access and allowed browser origins for Studio. Google fonts are fetched during the build.

The canonical domain and social metadata currently reference `restauranga.se`. Check these before using a different domain.

### Enquiry email status

The endpoint currently sends from `onboarding@resend.dev`, a test sender, to the restaurant and then attempts a customer confirmation. Before live use, verify an appropriate sender domain in Resend, update the sender address, and test both messages. No email delivery was tested during repository preparation.

## Project status and usage rights

This repository preserves the existing website and documents its setup. It is not a claim that the site is ready for launch. Known code-quality findings, missing image fallbacks and verification limits are listed in [project status](docs/PROJECT_STATUS.md).

No open-source license is granted by this repository. Restaurant branding, photographs and other content remain subject to their owners' rights; confirm permission before reusing or redistributing them.
