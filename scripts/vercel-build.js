const { execSync } = require('child_process');

console.log('🚀 Running Vercel Build Script...');

// Auto-detect Database URL across various Vercel Postgres configurations or custom prefixes
const possibleDbKey = Object.keys(process.env).find(key => {
  const val = process.env[key];
  return (
    (key.includes('DATABASE_URL') || key.includes('POSTGRES_URL') || key.includes('PRISMA_URL')) &&
    typeof val === 'string' &&
    (val.startsWith('postgres://') || val.startsWith('postgresql://'))
  );
});

const resolvedDbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  (possibleDbKey ? process.env[possibleDbKey] : undefined);

if (resolvedDbUrl) {
  process.env.DATABASE_URL = resolvedDbUrl;
  console.log('🔗 Resolved PostgreSQL connection from environment.');
}

try {
  // Step 1: Prisma generate
  console.log('📦 Step 1: Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });

  // Step 2: Database sync & seed if PostgreSQL is configured
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    console.log('🔄 Step 2: Pushing schema to PostgreSQL database...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', env: process.env });
      console.log('🌱 Step 3: Seeding initial data (Admin & Samples)...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: process.env });
    } catch (dbErr) {
      console.warn('⚠️ Warning: Database sync or seed encountered an issue:', dbErr.message);
    }
  } else {
    console.log('ℹ️ Remote DATABASE_URL not detected. Skipping db push & seed during build.');
  }

  // Step 3: Next.js build
  console.log('⚡ Step 4: Compiling Next.js application...');
  execSync('next build', { stdio: 'inherit', env: process.env });
  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Build script failed:', error);
  process.exit(1);
}
