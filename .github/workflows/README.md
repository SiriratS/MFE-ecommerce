# GitHub Actions CI/CD Workflow - Nx Monorepo

This ecommerce-platform uses an automated CI/CD pipeline with GitHub Actions optimized for **Nx monorepo** and **pnpm**.

## Workflow Overview

The workflow consists of 5 jobs that run in sequence:

```
Prepare → Lint & Test (parallel) → Build → Security Scan
```

### Jobs

1. **Prepare** - Installs dependencies with pnpm and caches both pnpm store and Nx cache
2. **Lint** - Runs ESLint on all projects in parallel (must pass before build)
3. **Test** - Runs unit tests on all projects with coverage (must pass before build)
4. **Build** - Builds all applications for production
5. **Security Scan** - Checks for vulnerabilities using pnpm audit

## Nx Projects in This Monorepo

- **main** - Main application
- **cart** - Cart library
- **cart-mfe** - Cart micro-frontend
- **profile** - Profile library
- **profile-mfe** - Profile micro-frontend
- **data-access** - Data access library
- **models** - Shared models library

## Workflow Triggers

The workflow automatically runs on:

- **Push** to any branch
- **Pull requests** to any branch
- **Manual trigger** via GitHub Actions UI (workflow_dispatch)

## Key Features

### ✅ Nx Optimization

- **Nx Caching** - Computation caching for faster builds
- **Parallel Execution** - Runs up to 3 tasks in parallel
- **Smart Builds** - Only rebuilds affected projects

### ✅ pnpm Package Manager

- **Fast Installation** - pnpm is faster than npm/yarn
- **Disk Space Efficient** - Content-addressable storage
- **Strict** - Uses frozen lockfile for reproducible builds

### ✅ Comprehensive Quality Checks

- **Lint** - All projects checked with ESLint
- **Test** - All projects tested with Jest (CI configuration with coverage)
- **Build** - All applications built for production
- **Security** - Dependency vulnerability scanning

## Commands Used

### Lint

```bash
pnpm nx run-many -t lint --all --parallel=3
```

Runs lint on all projects, up to 3 in parallel.

### Test

```bash
pnpm nx run-many -t test --all --parallel=3 --configuration=ci --coverage
```

Runs tests with CI configuration (no watch mode) and generates coverage reports.

### Build

```bash
pnpm nx run-many -t build --all --parallel=3 --configuration=production
```

Builds all applications for production.

### Security Scan

```bash
pnpm audit --audit-level=high
```

Checks for high and critical vulnerabilities.

## Caching Strategy

### pnpm Store Cache

Caches the global pnpm store to avoid re-downloading packages:

```yaml
path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
```

### Nx Cache

Caches Nx computation results for faster subsequent runs:

```yaml
path: .nx/cache
key: ${{ runner.os }}-nx-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ github.sha }}
```

## Artifacts

The workflow generates and stores the following artifacts for 7 days:

- **coverage-report** - Test coverage reports from all projects
- **build-artifacts** - Production build output from all applications

## Configuration

### Change Node.js Version

Update all jobs to use a different Node.js version:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18.x' # or '22.x', etc.
```

### Change pnpm Version

Update the pnpm version in all jobs:

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9 # Change to desired version
```

### Adjust Parallelization

Change the number of parallel tasks:

```yaml
# From 3 to 5 parallel tasks
run: pnpm nx run-many -t lint --all --parallel=5
```

### Run Only Affected Projects

To run only affected projects instead of all:

```yaml
# Change from --all to --affected
run: pnpm nx run-many -t lint --affected --parallel=3
```

### Adjust Security Audit Level

Modify the audit level in the Security Scan job:

```yaml
- name: Run pnpm audit
  run: pnpm audit --audit-level=moderate # or low, high, critical
```

## Troubleshooting

### Lint fails

- Run `pnpm nx run-many -t lint --all` locally to see errors
- Fix issues or update `eslint.config.mjs`

### Tests fail

- Run `pnpm nx run-many -t test --all` locally to debug
- Check individual project test configurations

### Build fails

- Run `pnpm nx run-many -t build --all` locally
- Check for TypeScript compilation errors
- Verify all dependencies are installed

### Security scan fails

- Run `pnpm audit` to see vulnerabilities
- Update packages with `pnpm update`
- Consider lowering audit level if needed

### Nx cache issues

- Clear local cache: `pnpm nx reset`
- The workflow will rebuild cache on next run

## Advanced Usage

### Run Specific Project

To run tasks on a specific project:

```yaml
- name: Build main app only
  run: pnpm nx build main --configuration=production
```

### Add E2E Tests

The monorepo already has Playwright configured. Add an E2E job:

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  needs: build
  steps:
    # ... setup steps ...
    - name: Run E2E tests
      run: pnpm nx run-many -t e2e --all
```

### Deploy After Success

Add deployment job that runs only on main branch:

```yaml
deploy:
  name: Deploy
  runs-on: ubuntu-latest
  needs: [build, security-scan]
  if: github.ref == 'refs/heads/main'
  steps:
    # Your deployment steps
```

### Use Nx Cloud

For even faster builds, enable Nx Cloud:

1. Run `pnpm nx connect` locally
2. Add the access token to GitHub secrets
3. Update workflow to use Nx Cloud:

```yaml
- name: Start Nx Cloud CI
  run: pnpm nx-cloud start-ci-run
```

## Benefits

✅ **Nx Optimized** - Leverages Nx caching and parallelization  
✅ **Fast** - pnpm + Nx cache = lightning fast CI  
✅ **Monorepo Aware** - Runs tasks across all projects  
✅ **Scalable** - Easily add more projects without changing workflow  
✅ **Fail-Fast** - Build only runs if lint and tests pass  
✅ **Comprehensive** - Lint, test, build, and security checks

## Next Steps

1. **Push to GitHub** - The workflow will run automatically
2. **Monitor in Actions tab** - See real-time progress
3. **Download artifacts** - Access coverage and build outputs
4. **Optimize** - Consider using `--affected` instead of `--all` for larger repos

---

Your GitHub Actions workflow is ready for your Nx monorepo! 🚀
