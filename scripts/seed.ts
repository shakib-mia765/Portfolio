import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
const environment =
  process.env.NODE_ENV ?? "development";

const seedRegistry = {
  users: [
    {
      email: "admin@ultrafaang.dev",
      name: "UltraFAANG Admin",
      role: "ADMIN",
    },
  ],
  projects: [
    {
      title: "UltraFAANG Portfolio",
      slug: "ultrafaang-portfolio",
      description:
        "Enterprise Full Stack Engineering Portfolio",
      status: "ACTIVE",
    },
  ],
};
const validateEnvironment = () => {
  if (environment === "production") {
    throw new Error(
      "Production database seeding is disabled",
    );
  }
};
const seedUsers = async () => {
  for (const user of seedRegistry.users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: user,
    });
  }
};
const seedProjects = async () => {
  for (const project of seedRegistry.projects) {
    await prisma.project.upsert({
      where: {
        slug: project.slug,
      },
      update: project,
      create: project,
    });
  }
};
const runSeedPipeline = async () => {
  validateEnvironment();

  const startTime = Date.now();

  await prisma.$transaction(async () => {
    await seedUsers();
    await seedProjects();
  });

  return {
    duration: `${Date.now() - startTime}ms`,
  };
};
const main = async () => {
  try {
    console.info(
      "Database seed started",
      {
        environment,
      },
    );
    const result = await runSeedPipeline();
    console.info(
      "Database seed completed",
      result,
    );
  } catch (error: unknown) {
    console.error(
      "Database seed failed",
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
    );
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};
main();
