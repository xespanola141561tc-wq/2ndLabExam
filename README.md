# CCE106 Practical Laboratory Examination

## Student Service Portal

### Student Information

Name: Xerted Joy Espanola
Section: CCE10 -2063
Date: 10-05-2026

### Required Features

- [x] Login
- [x] Authentication state
- [x] Secure token storage on Android/iOS
- [x] Protected navigation
- [x] Dashboard
- [x] Student API request
- [x] Loading state
- [x] Error state
- [x] Empty state
- [x] Search/filter
- [x] Dynamic student details
- [x] Profile
- [x] Session restoration
- [x] Logout

### API

The project uses the [DummyJSON API](https://dummyjson.com), matching the Postman
collection. The base URL is configured in `constants/api.ts`.

- `POST /auth/login`
- `GET /users`
- `GET /users/{id}`
- `GET /auth/me`

Demo login: `emilys` / `emilyspass`.

The student directory uses the `/users` endpoints and maps DummyJSON user fields
to the portal's student card fields.

### How to Run

```sh
npm install
npx expo start
```

Press `w` for web, or run `npm run web` directly. SecureStore persistence is
available on Android and iOS; web sessions are kept in memory for the current tab.
See the [Expo SDK 54 SecureStore documentation](https://docs.expo.dev/versions/v54.0.0/sdk/securestore/).

Compiler and lint checks:

```sh
npx tsc --noEmit
npm run lint
```

### Required Git Commits

Students must create at least five meaningful commits. Suggested examples:

- `exam: setup navigation`
- `exam: implement login`
- `exam: integrate student api`
- `exam: add dynamic student details`
- `exam: implement session and logout`

### Submission

Submit the GitHub repository URL according to the instructor's instructions.
