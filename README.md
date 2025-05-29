## 🩹 Linting & Code Style

We use **ESLint**, **Prettier**, and **TypeScript** to enforce consistent, high-quality code. This ensures readability, avoids bugs, and makes onboarding easier.

---

### 📦 Install Dependencies

Run this once after cloning the repo:

```bash
npm install
```

---

### 🧪 Run the Linter

To check for code issues:

```bash
npm run lint
```

---

### 🧼 Auto-Fix Issues

To automatically fix problems (like formatting and common bugs):

```bash
npm run lint:fix
```

---

### 💅 Format Code with Prettier

To format all supported files:

```bash
npm run format
```

---

### 🔐 Git Pre-commit Hook (Husky + lint-staged)

We use **Husky** and **lint-staged** to ensure all staged files pass linting and formatting before you commit.

#### Setup (Run Once):

```bash
npm install --save-dev husky lint-staged
npx husky install
npm run prepare
```

#### Add Pre-commit Hook:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

#### Example in `package.json`:

```json
"scripts": {
  "prepare": "husky install",
  "lint": "eslint . --ext .ts,.tsx",
  "lint:fix": "eslint . --fix --ext .ts,.tsx",
  "format": "prettier --write ."
},
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

---

### ✅ Linting Highlights

- ✅ Consistent import order and spacing
- ✅ No unused variables or imports
- ✅ Enforced naming conventions and file structure
- ✅ Auto-formatting with Prettier
- ✅ Strict TypeScript rules (e.g., no `any`, explicit return types)

---

> 💡 Pro Tip: Add a [VSCode workspace setting](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to run ESLint/Prettier automatically on save.

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```
