import { dirname } from "node:path"; // Perhatikan penambahan "node:"
import { fileURLToPath } from "node:url"; // Perhatikan penambahan "node:"
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // 1. Load Config Bawaan Next.js & TypeScript via Compat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2. Konfigurasi Manual Kita (Enterprise Rules)
  {
    rules: {
      // Wajibkan handling variable yang tidak terpakai
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      
      // Peringatkan penggunaan 'any'
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Jangan ada console.log di production code
      "no-console": "warn" 
    },
  },
  
  // 3. Global Ignores
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**"]
  }
];

export default eslintConfig;