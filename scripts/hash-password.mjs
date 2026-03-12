import { hashPassword } from '../src/lib/auth.ts';

const password = process.argv[2];
if (!password) {
  console.error('Uso: npm run hash-password -- <senha>');
  process.exit(1);
}

try {
  const hashed = await hashPassword(password);
  console.log(hashed);
} catch (error) {
  console.error('Erro ao gerar hash:', error);
  process.exit(1);
}
