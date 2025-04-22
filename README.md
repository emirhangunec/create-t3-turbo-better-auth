# Türkçe

## Giriş

Bu proje, `create-t3-app`'in [Better Auth](https://better-auth.com) kullanacak şekilde değiştirilmiş bir fork'udur. NextAuth yerine Better Auth kullanılmaktadır. Bu starter, Next.js ve React Native (Expo) ile full-stack TypeScript uygulamaları için bir monorepo kurulumu sağlamak üzere tasarlanmıştır.

**Better Auth**, TypeScript için framework-bağımsız bir kimlik doğrulama ve yetkilendirme kütüphanesidir:

- Ek kurulum gerektirmeden native Expo desteği (OAuth dahil)
- Ayrı bir proxy sunucusu gerektirmeyen önizleme dağıtımları
- Kapsamlı yerleşik özellikler ve eklenti ekosistemi

## Teknoloji Yığını

- **Framework'ler**: Next.js, Expo, React
- **Dil/Araçlar**: TypeScript, Turborepo, Drizzle ORM
- **Veritabanı**: Supabase (PostgreSQL)
- **API/State**: tRPC, Expo Router
- **UI/Styling**: Tailwind CSS, NativeWind, shadcn/ui
- **Kimlik Doğrulama**: Better Auth

## Kurulum

> **Not:** Başlamadan önce `package.json#engines` içinde belirtilen sistem gereksinimlerini (Node.js >=18.0.0, pnpm >=8.0.0) karşıladığınızdan emin olun.

### 1. Veritabanı Kurulumu

Eğer Supabase'i yerel ortamda çalıştırmak istemiyorsanız, Docker kullanarak bir PostgreSQL veritabanı kurabilirsiniz:

```bash
# PostgreSQL konteynerini oluştur ve başlat
docker run --name postgres-t3-turbo -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=t3-turbo -p 5432:5432 -d postgres

# Veritabanının başlatıldığını kontrol et
docker ps -a
```

Ardından `.env` dosyanızdaki `DATABASE_URL` değişkenini aşağıdaki gibi güncelleyin:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/t3-turbo"
```

### 2. Bağımlılıkları Kurma

```bash
# Bağımlılıkları yükle
pnpm i

# Ortam değişkenlerini yapılandır
# Kök dizinde referans olarak kullanabileceğiniz bir `.env.example` dosyası var
cp .env.example .env

# Drizzle şemasını veritabanına gönder
pnpm db:push
```

### 3. Expo `dev` Komutunu Yapılandırma

#### iOS Simulator Kullanımı

1. XCode ve Xcode Command Line Tools'un yüklü olduğundan emin olun ([Expo belgelerinde gösterildiği gibi](https://docs.expo.dev/workflow/ios-simulator)).

```diff
+  "dev": "expo start --ios",
```

2. Proje kök klasöründe `pnpm dev` komutunu çalıştırın.

#### Android Emulator Kullanımı

1. Android Studio araçlarını yükleyin ([Expo belgelerinde gösterildiği gibi](https://docs.expo.dev/workflow/android-studio-emulator)).

2. `apps/expo/package.json` dosyasındaki `dev` komutunu Android emülatörünü açacak şekilde değiştirin.

```diff
+  "dev": "expo start --android",
```

3. Proje kök klasöründe `pnpm dev` komutunu çalıştırın.

### 4. Better Auth Yapılandırması

Better Auth varsayılan olarak geliştirme ortamınızda çalışacak şekilde yapılandırılmıştır. Uygulamanızı dağıtmaya hazır olduğunuzda, `auth` paketinde `trustedOrigins` yapılandırmanız gerekecektir.

Bu, kimlik doğrulama sunucusuna istek yapmasına izin verilen kaynakların listesidir. Expo şemanızı bu listeye eklediğinizden ve `auth/src/expo.ts` dosyasında varsayılan olarak "expo" olan Expo şemanızla eşleşecek şekilde güncellediğinizden emin olun.

## Proje Yapısı

```
.github
  └─ workflows
        └─ pnpm önbelleği ile CI kurulumu
.vscode
  └─ VSCode kullanıcıları için önerilen uzantılar ve ayarlar
apps
  ├─ expo
  |   ├─ Expo SDK
  |   ├─ React kullanan React Native
  |   ├─ Expo Router ile navigasyon
  |   ├─ NativeWind ile Tailwind
  |   └─ tRPC kullanarak tipli API çağrıları
  └─ next.js
      ├─ Next.js
      ├─ React
      ├─ Tailwind CSS
      └─ E2E tipli API Server & Client
packages
  ├─ api
  |   └─ tRPC router tanımı
  ├─ auth
  |   └─ Better Auth kullanarak kimlik doğrulama
  ├─ db
  |   └─ Drizzle & Supabase kullanarak tipli veritabanı çağrıları
  └─ ui
      └─ shadcn-ui bileşenleriyle web için UI paketi
tooling
  ├─ eslint
  |   └─ paylaşılan, ince ayarlı eslint presetleri
  ├─ prettier
  |   └─ paylaşılan prettier yapılandırması
  ├─ tailwind
  |   └─ paylaşılan tailwind yapılandırması
  └─ typescript
      └─ extend edebileceğiniz paylaşılan tsconfig
```

> Bu şablonda, paket adları için `@acme` yer tutucusunu kullanıyoruz. Kullanıcı olarak, bunu kendi organizasyon veya proje adınızla değiştirmek isteyebilirsiniz. `@acme`'nin tüm örneklerini `@sirketim` veya `@proje-adi` gibi bir şeyle değiştirmek için bul-değiştir kullanabilirsiniz.

## Geliştirme

### UI Bileşenleri Ekleme

Yeni bir UI bileşeni eklemek için interaktif `shadcn/ui` CLI'ını kullanmak üzere `ui-add` komutunu çalıştırın:

```bash
pnpm ui-add
```

Bileşen(ler) kurulduktan sonra, uygulamanızda kullanmaya başlayabilirsiniz.

### Yeni Paket Ekleme

Yeni bir paket eklemek için, monorepo kök dizininde şunu çalıştırın:

```bash
pnpm turbo gen init
```

Bu, sizden bir paket adı ve herhangi bir bağımlılık kurmak isteyip istemediğinizi soracaktır. Oluşturucu, `package.json`, `tsconfig.json` ve `index.ts` dosyalarını kurar ve ayrıca paketinizin etrafındaki tüm gerekli araçları yapılandırır.

### Veritabanı Studio'yu Çalıştırma

Veritabanı yönetimi için Drizzle Studio'yu açmak için:

```bash
pnpm db:studio
```

### Kullanılabilir Komutlar

- `pnpm build` - Tüm paketleri ve uygulamaları derleme
- `pnpm dev` - Tüm uygulamalar için geliştirme sunucusunu başlatma
- `pnpm dev:next` - Sadece Next.js uygulamasını başlatma
- `pnpm lint` - Tüm paketler için linting çalıştırma
- `pnpm lint:fix` - Linting çalıştırma ve sorunları düzeltme
- `pnpm format` - Biçimlendirmeyi kontrol etme
- `pnpm format:fix` - Biçimlendirme sorunlarını düzeltme
- `pnpm typecheck` - Tüm paketler için tip kontrolü çalıştırma

## Dağıtım

### Next.js

> **Not:** Next.js uygulamasının tRPC ile dağıtılması, Expo uygulamasının üretim ortamında sunucuyla iletişim kurabilmesi için gereklidir.

#### Vercel'e Dağıtım

Next.js uygulamasını [Vercel](https://vercel.com)'e dağıtalım:

1. Vercel'de yeni bir proje oluşturun, kök dizin olarak `apps/nextjs` klasörünü seçin.
2. `DATABASE_URL` ve diğer ortam değişkenlerinizi ekleyin.
3. Dağıtım tamamlandı! Uygulamanız yayında olmalı. Alan adınızı atayın ve Expo uygulamasındaki `url` için `localhost` yerine bunu kullanın.

### Expo

Expo uygulamanızı dağıtmak için, [Apple App Store](https://www.apple.com/app-store) ve [Google Play](https://play.google.com/store/apps) gibi uygulama mağazalarına derleme sürümlerini göndermeniz gerekecektir.

1. `getBaseUrl` fonksiyonunu üretim backend URL'nize işaret edecek şekilde değiştirin.

2. [EAS Build](https://docs.expo.dev/build/introduction)'i kurun:

   ```bash
   # EAS CLI'ı yükleyin
   pnpm add -g eas-cli

   # Expo hesabınızla giriş yapın
   eas login

   # Expo uygulamanızı yapılandırın
   cd apps/expo
   eas build:configure
   ```

3. İlk derlemenizi oluşturun:

   ```bash
   eas build --platform ios --profile production
   ```

4. Uygulama mağazalarına gönderin:

   ```bash
   eas submit --platform ios --latest
   ```

   > Derleme ve göndermeyi birleştirebilirsiniz: `eas build ... --auto-submit`

5. OTA güncellemeleri için [EAS Update](https://docs.expo.dev/eas-update/getting-started)'i kurun:

   ```bash
   # expo-updates kütüphanesini ekleyin
   cd apps/expo
   pnpm expo install expo-updates

   # EAS Update'i yapılandırın
   eas update:configure
   ```

6. Güncellemeleri gönderin:

   ```bash
   cd apps/expo
   eas update --auto
   ```

## SSS

### Bu başlangıç projesinde Solito var mı?

Hayır. Solito bu repoda dahil değildir. Next.js ve Expo arasında kod paylaşımı için harika bir araç olsa da, bu reponun ana amacı bir T3 Uygulamasının monorepo içinde kod bölme işlemini göstermektir.

Solito'yu [resmi şablonlara](https://github.com/nandorojo/solito/tree/master/example-monorepos) bakarak entegre edebilirsiniz.

### Bu pattern backend kodunu istemci uygulamalara sızdırır mı?

Hayır. `api` paketi yalnızca Next.js uygulamasında bir production bağımlılığı olmalıdır. Expo uygulaması, `api` paketini sadece tip güvenliği için bir dev bağımlılığı olarak eklemelidir, bu da backend kodunuzu güvende tutar.

İstemci ve sunucu arasında çalışma zamanı kodu paylaşmanız gerekiyorsa (doğrulama şemaları gibi), ayrı bir `shared` paketi oluşturun ve her iki tarafta da içe aktarın.

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir Pull Request göndermekten çekinmeyin.

## Referanslar

- Bu yığın [create-t3-app](https://github.com/t3-oss/create-t3-app)'ten türetilmiştir
- Bir T3 uygulamasını bu yapıya taşıma hakkında bir [blog yazısı](https://jumr.dev/blog/t3-turbo)

## Lisans

Bu proje, [LICENSE](./LICENSE) dosyasında bulunan lisans koşulları altında lisanslanmıştır.

---

# English

## Introduction

This is a fork of `create-t3-app` modified to use [Better Auth](https://better-auth.com) instead of NextAuth. It's designed to provide a monorepo setup for full-stack TypeScript applications featuring Next.js and React Native (Expo).

**Better Auth** is a framework-agnostic authentication and authorization library for TypeScript offering:

- Native Expo support without extra setup (including OAuth)
- Preview deployments without the need for a separate proxy server
- A comprehensive set of built-in features and plugin ecosystem

## Tech Stack

- **Frameworks**: Next.js, Expo, React
- **Language/Tooling**: TypeScript, Turborepo, Drizzle ORM
- **Database**: Supabase (PostgreSQL)
- **API/State**: tRPC, Expo Router
- **UI/Styling**: Tailwind CSS, NativeWind, shadcn/ui
- **Authentication**: Better Auth

## Installation

> **Note:** Make sure to follow the system requirements specified in `package.json#engines` (Node.js >=18.0.0, pnpm >=8.0.0) before proceeding.

### 1. Database Setup

If you don't want to run Supabase locally, you can set up a PostgreSQL database using Docker:

```bash
# Create and start PostgreSQL container
docker run --name postgres-t3-turbo -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=t3-turbo -p 5432:5432 -d postgres

# Check that the database is running
docker ps -a
```

Then update the `DATABASE_URL` variable in your `.env` file to:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/t3-turbo"
```

### 2. Setup Dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# Push the Drizzle schema to the database
pnpm db:push
```

### 3. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have Xcode and Xcode Command Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

```diff
+  "dev": "expo start --ios",
```

2. Run `pnpm dev` at the project root folder.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Change the `dev` script at `apps/expo/package.json` to open the Android emulator.

```diff
+  "dev": "expo start --android",
```

3. Run `pnpm dev` at the project root folder.

### 4. Configuring Better Auth

By default, Better Auth is configured to work in your development environment. When you're ready to deploy your app, you'll need to configure `trustedOrigins` in the `auth` package.

This is a list of origins permitted to make requests to the auth server. Be sure to add your Expo scheme to this list and update it in `auth/src/expo.ts` to match your Expo scheme, which is set to "expo" by default.

## Project Structure

```
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ expo
  |   ├─ Expo SDK
  |   ├─ React Native using React
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   └─ Typesafe API calls using tRPC
  └─ next.js
      ├─ Next.js
      ├─ React
      ├─ Tailwind CSS
      └─ E2E Typesafe API Server & Client
packages
  ├─ api
  |   └─ tRPC router definition
  ├─ auth
  |   └─ Authentication using Better Auth
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Supabase
  └─ ui
      └─ UI package with shadcn-ui components
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Development

### Adding UI Components

To add a new UI component, run the `ui-add` script to use the interactive `shadcn/ui` CLI:

```bash
pnpm ui-add
```

When the component(s) has been installed, you can start using it in your app.

### Adding New Packages

To add a new package, run the following in the monorepo root:

```bash
pnpm turbo gen init
```

This will prompt you for a package name and whether you want to install any dependencies. The generator sets up the `package.json`, `tsconfig.json` and `index.ts`, as well as configures all necessary tooling around your package.

### Running the Database Studio

To open the Drizzle Studio for database management:

```bash
pnpm db:studio
```

### Available Scripts

- `pnpm build` - Build all packages and applications
- `pnpm dev` - Start the development server for all apps
- `pnpm dev:next` - Start only the Next.js application
- `pnpm lint` - Run linting for all packages
- `pnpm lint:fix` - Run linting and fix issues
- `pnpm format` - Check formatting
- `pnpm format:fix` - Fix formatting issues
- `pnpm typecheck` - Run type checking for all packages

## Deployment

### Next.js

> **Note:** The Next.js application with tRPC must be deployed for the Expo app to communicate with the server in production.

#### Deploy to Vercel

Let's deploy the Next.js application to [Vercel](https://vercel.com):

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory.
2. Add your `DATABASE_URL` and other environment variables.
3. Deploy! Your app should be live. Assign your domain and use that instead of `localhost` for the `url` in the Expo app.

### Expo

To deploy your Expo application, you'll need to submit builds to app stores like the [Apple App Store](https://www.apple.com/app-store) and [Google Play](https://play.google.com/store/apps).

1. Modify the `getBaseUrl` function to point to your production backend URL.

2. Set up [EAS Build](https://docs.expo.dev/build/introduction):

   ```bash
   # Install the EAS CLI
   pnpm add -g eas-cli

   # Log in with your Expo account
   eas login

   # Configure your Expo app
   cd apps/expo
   eas build:configure
   ```

3. Create your first build:

   ```bash
   eas build --platform ios --profile production
   ```

4. Submit to the app stores:

   ```bash
   eas submit --platform ios --latest
   ```

   > You can combine build and submit: `eas build ... --auto-submit`

5. Set up [EAS Update](https://docs.expo.dev/eas-update/getting-started) for Over-The-Air updates:

   ```bash
   # Add the expo-updates library
   cd apps/expo
   pnpm expo install expo-updates

   # Configure EAS Update
   eas update:configure
   ```

6. Push updates with:

   ```bash
   cd apps/expo
   eas update --auto
   ```

## FAQ

### Does the starter include Solito?

No. Solito is not included in this repo. It's a great tool for sharing code between Next.js and Expo, but the main purpose of this repo is to demonstrate code splitting of a T3 App into a monorepo.

You can integrate Solito by referring to the [official templates](https://github.com/nandorojo/solito/tree/master/example-monorepos).

### Does this pattern leak backend code to client applications?

No. The `api` package should only be a production dependency in the Next.js application. The Expo app should only add the `api` package as a dev dependency for typesafety, keeping your backend code secure.

If you need to share runtime code between client and server (like validation schemas), create a separate `shared` package and import it on both sides.

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## References

- The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app)
- A [blog post](https://jumr.dev/blog/t3-turbo) on migrating a T3 app into this structure

## License

This project is licensed under the terms of the license found in the [LICENSE](./LICENSE) file.
