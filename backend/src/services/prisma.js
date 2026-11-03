// =============================================================
// PRISMA CLIENT — Database Connection
// =============================================================
// This file creates a single Prisma Client instance that we
// reuse everywhere in the app. We do this to avoid creating
// a new database connection every time we need to query data.
//
// Usage in other files:
//   const prisma = require('../services/prisma');
//   const users = await prisma.user.findMany();
// =============================================================

const { PrismaClient } = require('@prisma/client');

// Create one instance and reuse it across the entire application
const prisma = new PrismaClient();

module.exports = prisma;
