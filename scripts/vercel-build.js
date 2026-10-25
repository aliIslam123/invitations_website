const { execSync } = require('child_process');

console.log('🚀 Running Vercel Build Script...');

try {
  // Step 1: Prisma generate
  console.log('📦 Step 1: Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Step 2: Database sync & seed if DATABASE_URL is configured
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    console.log('🔄 Step 2: Pushing schema to PostgreSQL database...');
    try {
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('🌱 Step 3: Seeding initial data (Admin & Samples)...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
    } catch (dbErr) {
      console.warn('⚠️ Warning: Database sync or seed encountered an issue:', dbErr.message);
    }
  } else {
    console.log('ℹ️ Remote DATABASE_URL not detected. Skipping db push & seed during build.');
  }

  // Step 3: Next.js build
  console.log('⚡ Step 4: Compiling Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  console.log('🎉 Build completed successfully!');
} catch (error) {
  console.error('❌ Build script failed:', error);
  process.exit(1);
}
