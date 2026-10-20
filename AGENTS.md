# Project Workflow Rules

## Automatic Live Deployment
Whenever any code modification, bug fix, or feature update is completed:
1. Validate the build to ensure there are no compilation or syntax errors.
2. Immediately stage and commit the changes using `git`.
3. Push the commit to the `main` branch (`git push origin main`).
4. This will trigger an automatic live deployment on Vercel (https://madrash.vercel.app).
