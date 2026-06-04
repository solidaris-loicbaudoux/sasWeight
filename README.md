# IcasSso

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests (Playwright)

Les tests E2E utilisent [Playwright](https://playwright.dev/) avec une authentification MSAL v4 mockée (Solution C — mock complet, aucun accès Azure AD réel).

### Prérequis

```bash
npm install                         # Installe @playwright/test
npx playwright install chromium     # Installe le navigateur de test
```

### Génération automatique du storage state (user.json)

Le fichier `.auth/user.json` contient un token fictif injecté dans le localStorage pour bypasser Azure AD. Il est **généré automatiquement** à chaque `npm run e2e` via le projet `setup` (dependency déclarée dans `playwright.config.ts`).

> **.auth/ est dans .gitignore** — chaque développeur génère son propre fichier localement.

### Scripts disponibles

```bash
npm run e2e              # Lance tous les tests (setup + e2e)
npm run e2e:setup        # Régénère uniquement .auth/user.json (npm start requis)
npm run e2e:headed       # Tests avec navigateur visible
npm run e2e:ui           # Interface graphique Playwright
npm run e2e:report       # Affiche le rapport HTML du dernier run
```

### Procédure complète pour un nouveau développeur

```bash
# 1. Démarrer l'application Angular (dans un terminal séparé)
npm start

# 2. Dans un second terminal, lancer les tests
npm run e2e
```

La première exécution crée `.auth/user.json`. Les runs suivants le réutilisent (valide 90 jours).

> Si les tests échouent avec "No such file: user.json" ou "token expired", supprimer `.auth/user.json`
> et relancer `npm run e2e` ou `npm run e2e:setup`.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
