# Build Notes for storefront-layouts

## Important: Build Strategy

This package is designed to be **transpiled by Next.js** in the consuming applications (`storefront-app` and `storefront-admin`). The TypeScript compilation errors you see when building standalone are **expected and acceptable** because:

1. The package uses `@/` path aliases that are resolved by the consuming apps
2. The package depends on utilities and components from the consuming apps
3. Next.js will transpile the package using `transpilePackages` configuration

## Build Options

### Option 1: Build with Type Errors (Recommended for Publishing)

The package will compile to JavaScript even with type errors. The consuming apps will handle type checking:

```bash
npm run build
```

This will:
- Generate JavaScript files in `dist/`
- Generate TypeScript declaration files (with some type errors)
- Copy JSON files

The type errors won't prevent the package from working in consuming apps.

### Option 2: Skip Type Checking (Faster Build)

If you want to skip type checking entirely during build, you can modify the build script:

```json
{
  "scripts": {
    "build": "tsc --noEmitOnError false && npm run copy-json"
  }
}
```

Or use `tsc --skipLibCheck` (already enabled).

### Option 3: Build in Consuming Apps

The recommended approach is to let Next.js handle transpilation:

1. Keep the package as source TypeScript files
2. Configure consuming apps with `transpilePackages: ['storefront-layouts']`
3. Next.js will transpile on-the-fly

However, for npm publishing, you need compiled JavaScript.

## Publishing Strategy

For npm publishing, use **Option 1**. The compiled JavaScript will work correctly in consuming apps because:

- Next.js will transpile the package again
- The `@/` imports will be resolved by the consuming app's TypeScript config
- Type errors in declarations won't affect runtime

## Verification

After building, verify the output:

```bash
ls -la dist/
```

You should see:
- `index.js` and `index.d.ts`
- `json/` directory with JSON files
- `layouts/` directory with compiled components

## Consuming App Configuration

Both `storefront-app` and `storefront-admin` need:

1. **next.config.ts**:
```typescript
const nextConfig = {
  transpilePackages: ['storefront-layouts'],
};
```

2. **tsconfig.json** (already configured):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "storefront-layouts": ["../storefront-layouts/src"]
    }
  }
}
```

When using npm package, the path mapping for `storefront-layouts` can be removed as it will resolve from `node_modules`.

