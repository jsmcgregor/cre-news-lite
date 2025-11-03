// Simple script to check environment variables
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('USE_MOCK_DATA:', process.env.USE_MOCK_DATA);
console.log('ENABLE_SOURCES:', process.env.ENABLE_SOURCES);
console.log('Config defaults:');
console.log('USE_MOCK_DATA default:', process.env.USE_MOCK_DATA === 'true' ? true : false);
