
import mongoose from 'mongoose';
import User from '../models/User';
import prisma from '../config/prisma';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@fastcareers.in';

    // 1. Seed into PostgreSQL if Prisma is available
    if (prisma) {
      try {
        const pgAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!pgAdmin) {
          await prisma.user.create({
            data: {
              firstName: 'System',
              lastName: 'Admin',
              email: adminEmail,
              password: '$2b$10$defaultHashPlaceholderForSafety1234567890',
              role: 'admin',
              profileCompleted: true
            }
          });
          console.log('[PostgreSQL] Admin user verified.');
        }
      } catch (pgErr: any) {
        console.warn('[PostgreSQL Admin Seed Note]:', pgErr.message);
      }
    }

    // 2. Only seed MongoDB if MongoDB connection is active
    if (mongoose.connection.readyState === 1) {
      const adminUser = await User.findOne({ email: adminEmail });
      
      // Ensure actual admin exists
      if (adminUser) {
        adminUser.password = 'Admin@123';
        await adminUser.save();
      } else {
        await User.create({
          firstName: 'System',
          lastName: 'Admin',
          email: adminEmail,
          password: 'Admin@123',
          role: 'admin',
          profileCompleted: true
        });
      }

      // DEMOTE all fake admins
      const allowedAdmins = ['admin@fastcareers.in', 'divyayadav141203@gmail.com', 'divyanshyadav10270@gmail.com'];
      await User.updateMany(
        { role: 'admin', email: { $nin: allowedAdmins } },
        { $set: { role: 'employer' } }
      );
      console.log('MongoDB Admin seed & cleanup ran successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

