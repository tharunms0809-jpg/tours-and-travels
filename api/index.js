/**
 * Vercel Serverless Entry Point
 * Wraps the Express app — Vercel uses the exported app as the HTTP handler.
 * Environment variables come from Vercel Dashboard settings (not .env file).
 */
const app = require('../server/server');

module.exports = app;
