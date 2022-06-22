
# setup-private-npm.actions

Setup private NPM configuration in CI environments.


## Usage

```yaml
name: PR

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  ci:
    name: CI
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Setup Node
      uses: actions/setup-node@v2
      with:
        node-version: '16.x'

    - name: Configure private packages
      uses: altipla-consulting/setup-private-npm.actions@main
      with:
        fontawesome-token: ${{ secrets.FONTAWESOME_TOKEN }}
        github-token: ${{ secrets.GITHUB_TOKEN }}

    - name: Cache node modules
      id: cache-npm
      uses: actions/cache@v3
      env:
        cache-name: cache-node-modules
      with:
        path: ~/.npm
        key: build-${{ env.cache-name }}-${{ hashFiles('package-lock.json') }}
        restore-keys: |
          build-${{ env.cache-name }}-
          build-

    - name: Install deps
      run: npm ci

    - name: Lint
      run: npm run lint
```
