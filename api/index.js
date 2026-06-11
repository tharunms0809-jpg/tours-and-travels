/**
 * Vercel Serverless Entry Point
 * This file wraps the Express app for Vercel's serverless runtime.
 */
const path = require('path');

// Load env variables from the root .env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = require('../server/server');

module.exports = app;
