/**
 * Vercel Serverless Entry Point
 * Wraps the Express app — Vercel uses the exported app as the HTTP handler.
 * Environment variables come from Vercel Dashboard settings (not .env file).
 *
 * NOTE: In serverless, each request may spin up a new instance.
 * The connectDB() in server.js uses readyState check to reuse connections.
 */
const app = require('../server/server');

module.exports = app;
