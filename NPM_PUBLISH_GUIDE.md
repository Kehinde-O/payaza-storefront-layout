# NPM Publish Guide for storefront-layouts

This guide explains how to build and publish the `storefront-layouts` package to npm.

## Prerequisites

1. **NPM Account**: You need an npm account. Create one at [npmjs.com](https://www.npmjs.com/signup)
2. **Login**: Run `npm login` to authenticate
3. **Package Name**: Ensure the package name `storefront-layouts` is available (or use a scoped name like `@your-org/storefront-layouts`)

## Building the Package

### Step 1: Clean Previous Builds

```bash
cd storefront-layouts
npm run clean
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript in the `dist/` directory
- Generate TypeScript declaration files (`.d.ts`)
- Copy JSON files to `dist/json/`

### Step 4: Verify Build Output

Check that the `dist/` directory contains:
- `index.js` - Main entry point
- `index.d.ts` - TypeScript declarations
- `json/` - JSON layout files
- `layouts/` - Compiled layout components

```bash
ls -la dist/
```

## Publishing to NPM

### Option 1: Publish to Public NPM Registry

```bash
# Dry run to see what will be published
npm pack --dry-run

# Publish to npm
npm publish
```

### Option 2: Publish to Private/Scoped Package

If using a scoped package name (e.g., `@your-org/storefront-layouts`):

1. Update `package.json`:
```json
{
  "name": "@your-org/storefront-layouts",
  "publishConfig": {
    "access": "restricted"  // or "public" for public scoped packages
  }
}
```

2. Publish:
```bash
npm publish
```

### Option 3: Publish to GitHub Packages

1. Add to `package.json`:
```json
{
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

2. Authenticate:
```bash
npm login --registry=https://npm.pkg.github.com
```

3. Publish:
```bash
npm publish
```

## Version Management

### Update Version

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### Pre-release Versions

```bash
# Beta version
npm version prerelease --preid=beta

# Alpha version
npm version prerelease --preid=alpha
```

## Using the Published Package

### In storefront-app

1. Update `package.json`:
```json
{
  "dependencies": {
    "storefront-layouts": "^1.0.0"
  }
}
```

2. Install:
```bash
npm install
```

3. Import (no changes needed):
```typescript
import { FoodHomePage } from 'storefront-layouts';
```

### In storefront-admin

1. Update `package.json`:
```json
{
  "dependencies": {
    "storefront-layouts": "^1.0.0"
  }
}
```

2. Install:
```bash
npm install
```

3. Import:
```typescript
import { getLayoutJSON } from 'storefront-layouts';
```

## Next.js Configuration

Both consuming apps need to transpile the package:

```typescript
// next.config.ts
const nextConfig = {
  transpilePackages: ['storefront-layouts'],
};
```

## TypeScript Configuration

No special TypeScript configuration needed - the package includes type definitions.

## Troubleshooting

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check TypeScript version compatibility
- Verify all imports are correct

### Publishing Errors

- Verify you're logged in: `npm whoami`
- Check package name availability
- Ensure version number is incremented

### Import Errors in Consuming Apps

- Run `npm install` after publishing
- Clear `.next` cache: `rm -rf .next`
- Restart dev server
- Verify `transpilePackages` in `next.config.ts`

## Development Workflow

For local development, you can use:

```json
{
  "dependencies": {
    "storefront-layouts": "file:../../storefront-layouts"
  }
}
```

This allows you to make changes and test without publishing.

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## Package Contents

The published package includes:
- `dist/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Package documentation
- `package.json` - Package metadata

Excluded from package:
- `src/` - Source files
- `node_modules/` - Dependencies
- `tsconfig.json` - TypeScript config
- Development files

