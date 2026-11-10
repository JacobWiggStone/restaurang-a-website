# Repository preparation status

Checked on 10 November 2026. Application source was preserved during repository preparation; documentation and repository housekeeping were added.

## Verification performed

- TypeScript: `./node_modules/.bin/tsc --noEmit --incremental false` passed with exit code 0 using the installed local dependencies.
- Production build: `npm run build` failed because the existing local dependency installation is missing the native `lightningcss.darwin-arm64.node` module. A clean dependency installation and successful rebuild are still required; this result does not establish whether a fresh hosting build will pass.
- ESLint: `npm run lint` failed with 8 errors and 24 warnings. Seven errors concern home links using `<a>` instead of Next.js `Link`; one concerns synchronous state updates inside an effect on the enquiry page. Warnings concern image optimization and unused variables.
- Local asset inventory: nine restaurant image files are present. Two literal image paths used by the source have no corresponding local files: `/images/restaurang-a/lunch.jpg` and `/images/restaurang-a/catering.jpg`. Sanity image configuration may supply replacements in some places, but fallback images and social previews can still break.
- Pattern scan of source and documentation found no matches for selected common credential formats. This is a limited automated scan, not a guarantee that every possible secret is absent. Local environment files and generated output are excluded from the upload.

## Before launching the live website

1. Correct the existing lint errors and review warnings.
2. Restore or update the two missing local image paths; verify image fallbacks and social previews.
3. Replace the enquiry endpoint's Resend test sender with a verified sender and test restaurant delivery and customer confirmation. Customer confirmation failures currently do not make the form report failure once the restaurant email succeeds.
4. Verify published Sanity content, Studio access, responsive layouts and navigation in a browser.
5. Exercise form loading, validation, success, failure and retry states without sending unapproved messages to real people.
6. Verify canonical URLs and social metadata against the intended live domain.

No live deployment, DNS change, Sanity content export or real enquiry email is included in repository preparation. Local files do not contain a complete backup of the remote Sanity dataset.
