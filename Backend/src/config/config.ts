import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = 'b74e80581bd14d5ce100338ccd2a77d2dfaddaec88d17bab75b93c9c067502dba76e54887fdcdf2e5ed5ba2b6f55dec46ad4cb73b1220576f626dcebb59b8aea266755417cc9e3bc1dc48c969a53e1c1280cc8275d0526b3f45e3712032286afc9b06a7c6fac353098e3d5a9f84aa2a0b3d062ead7141620ae63b8fd81249d7f28393e823855883015193c03cc5f2b19d2c56d17f8d4fc00b5002294295a1fabb1adb7cb726ae9747855b215fde4c52b41e88bcee7c124fe4f85c6acad9a0ce32fa92a5e1c4eba51dd12ce0281c6bf69643458b5d9a304f70d34b3d971aad3ff041e177703825baf646a413aee34ee513263d72fbccdf6ebed6db3ad35ed53c74a85bbf697fe1b5f4dccc288e139d17e2536366de6060d57b7455aa5582c8068303cff8cb1266d2306cf0cfa80cf17369eeaab33ecadd474fc803a9903f6f063693b7456da54163f33cb0b6d01627194fa9cfa383c72bcfe272b142e7073fb3a319a55e2d304f2f820a17cade95966298dcc7e1eaeb4a35ca463e67d29c24f02'

const config = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/education',
    JWT_SECRET: process.env.JWT_SECRET || JWT_SECRET,
    PORT: process.env.PORT || 4000,
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/v1/auth/auth/google/callback',
}

export default config