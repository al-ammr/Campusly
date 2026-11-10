import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    pool: 'forks',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    env: {
      NODE_ENV: 'test',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_DEFAULT_CAMPUS_SLUG: 'abu-zaria',
      NEXT_PUBLIC_BUILD_ID: 'test-build',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/campusly_test',
      REDIS_URL: 'redis://localhost:6379',
      SESSION_SECRET: 'test_session_secret_minimum_32_characters_long_for_tests',
      JOB_SECRET: 'test_job_secret_minimum_16_chars',
      DATA_ENCRYPTION_KEY: '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      STORAGE_ACCESS_KEY_ID: 'mock_key',
      STORAGE_SECRET_ACCESS_KEY: 'mock_secret',
      STORAGE_BUCKET_NAME: 'test-bucket',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
