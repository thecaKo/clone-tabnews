import migrationsRunner from 'node-pg-migrate'
import { join } from 'node:path'
import database from 'infra/database.js'

export default async function Migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if(!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: "Method not allowed"
    });
  }
  const dbClient = await database.getNewClient();
  try {
  const defaultMigrationsSettings = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  }

  if (request.method === 'GET') {
    const migrations = await migrationsRunner(defaultMigrationsSettings);
    return response.status(200).json(migrations);
  }

  if (request.method === 'POST') {
    const migrations = await migrationsRunner({
      ...defaultMigrationsSettings,
      dryRun: false,
    });
    return response.status(200).json(migrations);
  }
  } catch(error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

