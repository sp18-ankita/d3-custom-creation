# ESLint Rules Documentation

## Introduction

This document outlines the ESLint rules enforced in this project to ensure code quality, consistency, and maintainability.  
The configuration applies to all TypeScript and React code in this repository.

All developers and contributors should familiarize themselves with these rules and refer to this guide when writing or reviewing code.  
Our linting philosophy emphasizes readability, simplicity, and adherence to industry best practices.

---

## Table of Contents

1. [TypeScript Rules](#typescript-rules)
2. [Code Clarity & Readability](#code-clarity--readability)
3. [Import Hygiene](#import-hygiene)
4. [React-Specific Rules](#react-specific-rules)
5. [Naming Conventions](#naming-conventions)
6. [Error Prevention](#error-prevention)
7. [Complexity & Maintainability](#complexity--maintainability)
8. [Formatting](#formatting)
9. [Extending or Overriding Rules](#extending-or-overriding-rules)
10. [References](#references)

---

## TypeScript Rules

| Rule                                             | Description                                                                      | Severity |
| ------------------------------------------------ | -------------------------------------------------------------------------------- | -------- | ------------------------- | ---- |
| `@typescript-eslint/consistent-type-definitions` | Enforce using `interface` instead of `type` for object type definitions.         | error    |
| `@typescript-eslint/prefer-nullish-coalescing`   | Warn when the nullish coalescing operator (`??`) could be used instead of `      |          | ` or ternary expressions. | warn |
| `@typescript-eslint/prefer-optional-chain`       | Warn when optional chaining (`?.`) could be used to simplify expressions.        | warn     |
| `@typescript-eslint/switch-exhaustiveness-check` | Require all switch cases on union types to be handled, preventing missing cases. | error    |
| `@typescript-eslint/no-inferrable-types`         | Warn when types are explicitly defined but can be inferred by TypeScript.        | warn     |

---

## Code Clarity & Readability

| Rule                  | Description                                                                                                            | Severity |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| `no-else-return`      | Disallow `else` blocks after `return` in `if` statements for clearer code flow.                                        | error    |
| `no-useless-return`   | Disallow unnecessary `return` statements that do not return a value.                                                   | error    |
| `no-unneeded-ternary` | Warn against ternary operators that can be simplified.                                                                 | warn     |
| `no-nested-ternary`   | Warn when ternary operators are nested, as they reduce readability.                                                    | warn     |
| `no-magic-numbers`    | Warn when numbers are used directly in code (except for `0`, `1`, `-1`, and array indexes). Enforces use of constants. | warn     |

---

## Import Hygiene

| Rule                          | Description                                                               | Severity |
| ----------------------------- | ------------------------------------------------------------------------- | -------- |
| `import/no-default-export`    | Warn against using default exports; encourages named exports for clarity. | warn     |
| `import/newline-after-import` | Require a blank line after import statements for better readability.      | error    |
| `import/no-duplicates`        | Disallow duplicate imports from the same module.                          | error    |

---

## React-Specific Rules

| Rule                             | Description                                                                                                  | Severity |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- |
| `react/jsx-boolean-value`        | Warn when boolean props are explicitly set to `true`; prefers shorthand (e.g., `<Comp prop />`).             | warn     |
| `react/self-closing-comp`        | Warn when components without children are not self-closed.                                                   | warn     |
| `react/jsx-curly-brace-presence` | Warn when curly braces are unnecessarily used for props or children.                                         | warn     |
| `react/jsx-handler-names`        | Enforce naming conventions for event handler props and functions (e.g., `onClick` handled by `handleClick`). | warn     |

---

## Naming Conventions

| Rule                | Description                                                                                 | Severity |
| ------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `camelcase`         | Enforce camelCase naming, but does not enforce it for object properties.                    | error    |
| `id-length`         | Warn if identifiers are shorter than 2 characters.                                          | warn     |
| `func-style`        | Warn if functions are not declared using function declarations, but allows arrow functions. | warn     |
| `consistent-return` | Require functions to consistently return a value or not return anything.                    | error    |
| `prefer-template`   | Warn when string concatenation could be replaced by template literals.                      | warn     |
| `no-shadow`         | Disallow variable declarations that shadow variables declared in the outer scope.           | error    |

---

## Error Prevention

| Rule                   | Description                                                                  | Severity |
| ---------------------- | ---------------------------------------------------------------------------- | -------- |
| `eqeqeq`               | Require use of `===` and `!==` instead of `==` and `!=` for equality checks. | error    |
| `default-case`         | Require a `default` case in switch statements.                               | error    |
| `no-implicit-coercion` | Warn against shorthand type conversions (e.g., `!!foo` or `+foo`).           | warn     |
| `no-param-reassign`    | Warn when function parameters are reassigned.                                | warn     |
| `no-return-await`      | Disallow unnecessary `return await` in async functions.                      | error    |

---

## Complexity & Maintainability

| Rule                     | Description                                            | Severity |
| ------------------------ | ------------------------------------------------------ | -------- |
| `max-lines-per-function` | Warn if a function exceeds 50 lines.                   | warn     |
| `max-params`             | Warn if a function has more than 4 parameters.         | warn     |
| `complexity`             | Warn if a function’s cyclomatic complexity exceeds 10. | warn     |
| `no-warning-comments`    | Warn when comments contain `fixme` or `todo`.          | warn     |

---

## Formatting

- **Prettier**:  
  This configuration includes Prettier for automatic code formatting, ensuring consistent style across the codebase.  
  All formatting issues will be reported and should be fixed according to Prettier's recommendations.

---

## Extending or Overriding Rules

To extend or override these rules:

1. Edit the `.eslint.config.js` file in the project root.
2. Add or modify rule definitions as needed.
3. If you need to disable a rule for a specific line or file, use ESLint comments such as `// eslint-disable-next-line rule-name`.

---

## References

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [TypeScript ESLint Plugin](https://typescript-eslint.io/)
- [ESLint Plugin Import](https://github.com/import-js/eslint-plugin-import)
- [ESLint Plugin React](https://github.com/jsx-eslint/eslint-plugin-react)
- [ESLint Plugin React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [Prettier](https://prettier.io/)

---

**By following these rules, we ensure our codebase remains clean, consistent, and easy to maintain.**
