import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical origin, in priority order:
 *   1. SITE_URL            — set this to the real domain once it exists
 *   2. Vercel's production URL, then the per-deployment URL
 *   3. localhost, for a local build
 *
 * Canonical tags, OG URLs and the sitemap all read from this, so setting SITE_URL in
 * the Vercel project is the entire "point it at the real domain" task.
 */
const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const site =
  process.env.SITE_URL ||
  (fromVercel ? `https://${fromVercel}` : 'http://localhost:3000');

export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  build: { inlineStylesheets: 'auto' },
});
