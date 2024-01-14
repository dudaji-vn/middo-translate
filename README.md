# Intermediate Translate

## Overview

This is a versatile translation app designed to help users bridge language barriers and facilitate effective communication.

## Features

- Multi-Language Support: Intermediate Translate supports a wide range of languages, making it suitable for global communication
- Text Translation: Type the phrase you want to translate, and the app will provide instant results. Perfect for translating written text on the go.
- Voice Translation: Speak the phrase you want to translate, and our app will convert your speech into the desired language, allowing you to have natural conversations.
- Document Translation: Upload documents in various formats, including PDF, Word, and more, and Intermediate Translate will quickly provide translations, preserving the original formatting.
- Image Translation: Upload image at printed text in a foreign language, and our app will instantly overlay translations on the screen.
- More features coming soon!

## Technologies Used

- Frontend: NextJs, TypeScript, Tailwind CSS, Zustand.

## Prerequisites

Make sure you have the following software installed on your machine:

- Node.js 16.8 or later.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dudaji-vn/middo-translate.git
```

2. Navigate to the project directory:

```bash
cd middo-translate
```

3. Install the dependencies:

```bash
yarn install
```

4. Set up environment variables:

- Make sure to set the values of these environment variables before running the app.
- Create a .env file in the root of the project.
- Define the following variables in the .env file, the values of which can be found in the tutorial [here](https://www.youtube.com/watch?v=Sjl9ilOpHG8&t=6s).
  - `TYPE`:
  - `PROJECT_ID`:
  - `PRIVATE_KEY_ID`:
  - `PRIVATE_KEY`:
  - `CLIENT_EMAIL`:
  - `CLIENT_ID`:
  - `AUTH_URI`:
  - `TOKEN_URI`:
  - `CLIENT_X509_CERT_URL`:
  - `UNIVERSE_DOMAIN`:

5. Run in development mode

```bash
npm run start
# or
yarn start
# or
pnpm start
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### TIP : Set up sentry (crash report)

- Set SENTRY_DSN

  - Go to https://dudajivn.sentry.io/projects/
  - Click setting button of project
  - Copy 'Client Keys (DSN)' and paste into it into .env 'SENTRY_DSN'

- Post sentry error
  ```
  import * as Sentry from '@sentry/react';
  Sentry.captureException(msg);
  ```