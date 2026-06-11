/**
 * Vercel Serverless Entry Point
 * Wraps the Express app for Vercel's serverless runtime.
 * Environment variables are set in the Vercel dashboard — no .env file needed here.
 */
const app = require('../server/server');

module.exports = app;
