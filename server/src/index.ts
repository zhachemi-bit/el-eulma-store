import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes/index.js';
import { setupSwagger } from './lib/swagger.js';

// ── Database & Bootstrap ──────────────────────────────────────────────────────
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

async function bootstrap() {
  try {
    // 1. Check Connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');

    // 2. Ensure Admin Exists
    const adminEmail = 'admin@admin.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      console.log('⚙️ Admin account missing. Creating default admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'System Administrator',
          password: hashedPassword,
          role: 'admin',
        }
      });
      console.log('✅ Default admin created: admin@admin.com / admin123');
    } else {
      console.log('✅ Admin account verified');
    }

  } catch (err: any) {
    console.error('❌ Database bootstrap FAILED');
    console.error(`   URL: ${process.env['DATABASE_URL']}`);
    console.error(`   Reason: ${err.message ?? err}`);
  } finally {
    await prisma.$disconnect();
  }
}
bootstrap();
// ─────────────────────────────────────────────────────────────────────────────

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup Swagger Documentation
setupSwagger(app);

// All API routes
app.use('/api', routes);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 API available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
});
