---
title: Slim 4 Best Practices
---

This article describes **best practices for developing web applications and APIs with Slim 4**. These recommendations are based on community experience and proven patterns that work well with Slim's minimalist philosophy.

> **Important:** Slim 4 is a **micro-framework**, not a full-stack framework. Unlike Symfony or Laravel, Slim provides only the essential tools (routing, middleware, PSR-7) and lets you choose additional components. This document recommends third-party packages and architectural patterns that work well with Slim, but **none are mandatory** - pick what fits your needs.

If you don't agree with some of these recommendations, they might be a good **starting point** that you can then **extend and fit to your specific needs**. You can even ignore them completely and continue using your own best practices and methodologies. Slim is flexible enough to adapt to your needs.

This article assumes that you already have experience developing Slim applications. If you don't, first read the [Getting Started](/docs/v4/start/installation.html) section of the documentation.

### What Slim 4 Provides Out of the Box

**Built-in:**
- PSR-7 HTTP message interfaces
- PSR-15 middleware support
- Routing (with named routes, groups, patterns)
- Dependency injection container interface (PSR-11)
- Error handling middleware

**NOT Built-in** (you choose your own):
- ORM/Database layer (use Doctrine, Eloquent, or PDO)
- Validation (use Respect/Validation or others)
- Template engine (use Twig, PHP-View, or others)
- Authentication/Authorization (implement with middleware)
- Forms, Events, Console commands (add if needed)

## Creating the Project

### Use Composer to Create Slim Applications

[Composer](https://getcomposer.org/) is the de facto standard for dependency management in PHP applications. It provides the simplest and most reliable way to create new Slim applications:

```bash
composer require slim/slim:"4.*"
composer require slim/psr7
```

This will install Slim 4 and a PSR-7 implementation needed for handling HTTP requests and responses.

### PHP Version Requirements

Slim 4 requires **PHP 7.4 or newer**. However, it's highly recommended to use **PHP 8.4** (the latest version as of 2024) to benefit from:

- **Performance improvements**: JIT compiler, optimized opcache
- **Type system enhancements**: Intersection types, readonly properties
- **Modern syntax**: Property hooks, asymmetric visibility
- **Better security**: Updated cryptography libraries
- **Active support**: PHP 8.4 receives security updates

```bash
# Verify your PHP version
php -v

# Should show PHP 8.4.x
```

### Use a Professional Directory Structure

Follow a comprehensive directory structure that scales with your application and separates concerns properly:

```text
your_project/
├─ bin/
│  └─ console.php              # CLI commands entry point
├─ config/
│  ├─ packages/                # Package-specific configurations
│  │  ├─ cache.php
│  │  ├─ doctrine.php
│  │  ├─ monolog.php
│  │  └─ twig.php
│  ├─ routes/                  # Route definitions by domain
│  │  ├─ api.php
│  │  ├─ web.php
│  │  └─ admin.php
│  ├─ dependencies.php         # DI container configuration
│  ├─ middleware.php           # Middleware stack configuration
│  └─ settings.php             # Application settings
├─ migrations/                 # Database migrations
│  ├─ Version20241021120000.php
│  └─ ...
├─ public/                     # Web server document root
│  ├─ assets/                  # Compiled/public assets
│  │  ├─ css/
│  │  ├─ js/
│  │  └─ images/
│  └─ index.php                # Application entry point
├─ resources/                  # Source assets (optional)
│  ├─ css/
│  ├─ js/
│  └─ images/
├─ src/
│  ├─ Application.php          # Application bootstrap class (optional)
│  ├─ Action/                  # HTTP action handlers (controllers)
│  │  ├─ Api/
│  │  │  ├─ User/
│  │  │  │  ├─ CreateUserAction.php
│  │  │  │  ├─ ListUsersAction.php
│  │  │  │  └─ ViewUserAction.php
│  │  │  └─ Post/
│  │  └─ Web/
│  ├─ Domain/                  # Business logic (domain layer)
│  │  ├─ User/
│  │  │  ├─ Entity/            # Domain entities (business models)
│  │  │  │  └─ User.php
│  │  │  ├─ Dto/               # Data Transfer Objects
│  │  │  │  ├─ CreateUserDto.php
│  │  │  │  └─ UserDto.php
│  │  │  ├─ Repository/        # Data access interfaces & implementations
│  │  │  │  ├─ UserRepositoryInterface.php
│  │  │  │  └─ UserRepository.php
│  │  │  ├─ Service/           # Business services
│  │  │  │  ├─ UserCreator.php
│  │  │  │  └─ UserAuthenticator.php
│  │  │  └─ Exception/
│  │  │     └─ UserNotFoundException.php
│  │  └─ Post/
│  │     ├─ Entity/
│  │     ├─ Dto/
│  │     ├─ Repository/
│  │     └─ Service/
│  ├─ Infrastructure/          # External services integration
│  │  ├─ Persistence/
│  │  │  └─ Doctrine/
│  │  ├─ Email/
│  │  │  └─ MailerService.php
│  │  └─ Cache/
│  │     └─ CacheService.php
│  ├─ Middleware/              # PSR-15 HTTP middleware
│  │  ├─ AuthenticationMiddleware.php
│  │  ├─ AuthorizationMiddleware.php
│  │  ├─ CorsMiddleware.php
│  │  └─ ValidationMiddleware.php
│  ├─ Handler/                 # Error handlers
│  │  ├─ HttpErrorHandler.php
│  │  └─ ShutdownHandler.php
│  ├─ Helper/                  # Helper classes & utilities
│  │  ├─ JwtHelper.php
│  │  ├─ PasswordHelper.php
│  │  └─ ValidationHelper.php
│  └─ Twig/                    # Twig extensions (if using Twig)
│     └─ AppExtension.php
├─ templates/                  # Twig/PHP templates
│  ├─ layout/
│  │  ├─ base.html.twig
│  │  └─ admin.html.twig
│  ├─ user/
│  │  ├─ profile.html.twig
│  │  └─ list.html.twig
│  └─ _partials/
│     ├─ _header.html.twig
│     └─ _footer.html.twig
├─ tests/                      # Test suite
│  ├─ Unit/
│  │  ├─ Domain/
│  │  │  └─ User/
│  │  │     └─ Service/
│  │  │        └─ UserCreatorTest.php
│  │  └─ Validation/
│  ├─ Integration/
│  │  └─ Repository/
│  │     └─ UserRepositoryTest.php
│  ├─ Functional/
│  │  └─ Action/
│  │     └─ User/
│  │        └─ CreateUserActionTest.php
│  └─ Fixtures/
│     └─ UserFixture.php
├─ translations/               # i18n translations (optional)
│  ├─ en/
│  │  └─ messages.xlf
│  └─ fr/
│     └─ messages.xlf
├─ var/                        # Generated/temporary files
│  ├─ cache/                   # Application cache
│  │  ├─ di/                   # DI container cache
│  │  └─ twig/                 # Twig compiled templates
│  ├─ log/                     # Log files
│  │  ├─ app.log
│  │  └─ error.log
│  └─ tmp/                     # Temporary files
├─ vendor/                     # Composer dependencies
├─ .env                        # Environment variables (DO NOT COMMIT)
├─ .env.example                # Example environment file
├─ .env.test                   # Test environment variables
├─ .gitignore
├─ .php-cs-fixer.php          # PHP CS Fixer configuration
├─ composer.json
├─ composer.lock
├─ phpunit.xml                 # PHPUnit configuration
└─ README.md
```

### Directory Purpose Explained

**Application Layer:**
- `bin/` - CLI entry points and console commands
- `config/` - All configuration files (settings, routes, dependencies)
- `public/` - Publicly accessible files (web server document root)

**Source Code (`src/`):**
- `Action/` - HTTP request handlers (replaces "Controller" in Slim)
- `Domain/` - Core business logic
  - `Entity/` - Domain entities (business models)
  - `Dto/` - Data Transfer Objects
  - `Repository/` - Data access layer
  - `Service/` - Business services
  - `Exception/` - Domain exceptions
- `Infrastructure/` - External integrations (database, email, cache)
- `Middleware/` - PSR-15 middleware components
- `Handler/` - Error handlers
- `Helper/` - Helper classes & utilities (JWT, Password, Validation)

**Resources:**
- `templates/` - View templates (Twig, PHP)
- `resources/` - Source assets (pre-compiled CSS, JS)
- `migrations/` - Database schema migrations
- `translations/` - i18n translation files

**Development:**
- `tests/` - Test suite (Unit, Integration, Functional)
- `var/` - Generated files (cache, logs, temporary)

### Benefits of This Structure

**Benefits of this structure:**

- **Separation of Concerns**: Clear boundaries between layers
- **Scalability**: Easy to add new features without cluttering
- **Testability**: Test structure mirrors source structure
- **Domain-Driven**: Business logic isolated in `Domain/`
- **PSR-4 Compliant**: Standard autoloading
- **Framework Agnostic**: Easy to migrate if needed
- **Team Friendly**: Clear conventions for collaboration

### Alternative Naming: Action vs Controller, Service Organization

There are different schools of thought on naming conventions. Here are the two main approaches:

#### Approach 1: Action + Service (Recommended - Shown Above)

```text
src/
├─ Action/              # HTTP request handlers
│  ├─ User/
│  │  ├─ CreateUserAction.php
│  │  ├─ UpdateUserAction.php
│  │  └─ DeleteUserAction.php
│  └─ Post/
└─ Domain/
   └─ User/
      └─ Service/       # Business logic services
         ├─ UserCreator.php
         ├─ UserUpdater.php
         └─ UserDeleter.php
```

**Rationale:**
- `Action` emphasizes **single responsibility** - one action, one class
- `Service` in Domain layer separates business logic from HTTP concerns
- Clear distinction: Actions handle HTTP, Services handle business logic
- More aligned with CQRS and hexagonal architecture
- Each Action class has `__invoke()` method (invokable)

**Example:**
```php
<?php
// src/Action/User/CreateUserAction.php
final readonly class CreateUserAction
{
    public function __construct(
        private UserCreator $userCreator,  // Service from Domain
    ) {}

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = (array) $request->getParsedBody();

        // Delegate business logic to service
        $user = $this->userCreator->create($data);

        // Return HTTP response
        return $this->jsonResponse($response, $user, 201);
    }
}
```

#### Approach 2: Controller + Service

```text
src/
├─ Controller/          # HTTP request handlers
│  ├─ UserController.php
│  └─ PostController.php
└─ Service/             # Business logic (at root level)
   ├─ UserService.php
   └─ PostService.php
```

**Rationale:**
- More familiar to developers coming from Laravel, Symfony
- `Controller` is a widely recognized term
- `Service` at root level is easy to find
- **Note:** Controllers tend to grow (multiple methods)
- **Note:** Less clear separation between HTTP and business logic

**Example:**
```php
<?php
// src/Controller/UserController.php
class UserController
{
    public function __construct(
        private UserService $userService,
    ) {}

    public function create(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        // ...
        return $response;
    }

    public function update(/* ... */) { }
    public function delete(/* ... */) { }
    // Multiple methods in one class
}
```

### Which Approach to Choose?

**Use Action + Domain/Service if:**
- You want **strict single responsibility** (one class = one HTTP endpoint)
- You prefer **domain-driven design** with clear layers
- Your application is **complex** with rich business logic
- You want to **easily test** each action independently
- You're building a **long-term, maintainable** application

**Use Controller + Service if:**
- You're coming from **Laravel/Symfony** and want familiar conventions
- Your application is **simple** (CRUD operations mostly)
- Your team is **more comfortable** with traditional MVC
- You want **fewer files** (multiple actions per controller)

### Hybrid Approach (Also Valid)

You can also use both simultaneously:

```text
src/
├─ Action/              # For complex, specific actions
│  └─ User/
│     └─ RegisterUserAction.php
├─ Controller/          # For simple CRUD
│  └─ PostController.php
└─ Domain/
   └─ User/
      └─ Service/
         └─ UserRegistrationService.php
```

### Our Recommendation

**For Slim 4 projects, we recommend the `Action` approach** because:

1. **Slim philosophy**: Slim is minimalist and encourages single-purpose handlers
2. **Scalability**: Easier to maintain as the application grows
3. **Testability**: Each action is isolated and easy to test
4. **Modern**: Aligns with current best practices (ADR pattern)
5. **Framework agnostic**: Not tied to MVC terminology

### Detailed Comparison

| Aspect | Action (Recommended) | Controller |
|--------|---------------------|------------|
| **Files** | More files, smaller | Fewer files, larger |
| **SOLID** | Single Responsibility | Often violates SRP |
| **Testing** | Easy (isolated) | Complex setup |
| **Dependencies** | Only what's needed | Shared across methods |
| **Scalability** | Excellent | Controllers grow large |
| **Learning Curve** | Unfamiliar to some | Familiar (MVC) |
| **Routing** | `::class` syntax | Array `[Class, 'method']` |
| **Slim Alignment** | Perfect fit | Works but not ideal |

### Real-World Example Comparison

**Controller Approach - Problems:**
```php
<?php
class UserController
{
    // 8 dependencies injected for ALL methods
    public function __construct(
        private UserRepository $repository,
        private UserValidator $validator,
        private PasswordHasher $hasher,
        private EmailService $emailService,
        private CacheService $cache,
        private LoggerInterface $logger,
        private EventDispatcher $events,
        private ImageUploader $uploader,
    ) {}

    public function create() {
        // Only uses: repository, validator, hasher, emailService
        // BUT all 8 dependencies are injected!
    }

    public function list() {
        // Only uses: repository, cache
        // Still has 8 dependencies injected!
    }

    public function updateAvatar() {
        // Only uses: repository, uploader
        // Unnecessary dependencies: validator, hasher, emailService, etc.
    }

    // ... 10 more methods = 300+ lines
}
```

**Action Approach - Clean:**
```php
<?php
// src/Action/User/CreateUserAction.php
final readonly class CreateUserAction
{
    // Only what THIS action needs
    public function __construct(
        private UserRepository $repository,
        private UserValidator $validator,
        private PasswordHasher $hasher,
        private EmailService $emailService,
    ) {}

    public function __invoke(...) { }
}

// src/Action/User/ListUsersAction.php
final readonly class ListUsersAction
{
    // Only what THIS action needs
    public function __construct(
        private UserRepository $repository,
        private CacheService $cache,
    ) {}

    public function __invoke(...) { }
}

// src/Action/User/UpdateUserAvatarAction.php
final readonly class UpdateUserAvatarAction
{
    // Only what THIS action needs
    public function __construct(
        private UserRepository $repository,
        private ImageUploader $uploader,
    ) {}

    public function __invoke(...) { }
}
```

However, **the most important thing is consistency**. Choose one approach and stick to it throughout your project. Both are valid - the structure matters more than the naming.

### Mixed Naming Considerations

**If using Controllers:**
```text
src/
├─ Controller/          # Use this name
│  └─ UserController.php
└─ Service/             # Keep at root or in Domain
   └─ UserService.php
```

**If using Actions:**
```text
src/
├─ Action/              # Use this name
│  └─ User/
│     └─ CreateUserAction.php
└─ Domain/
   └─ User/
      └─ Service/       # Keep in Domain layer
         └─ UserCreator.php
```

**Avoid mixing naming styles** (it causes confusion):
```text
Bad example:
src/
├─ Action/
│  └─ CreateUserController.php  # Inconsistent!
└─ Service/
   └─ UserAction.php             # Confusing!
```

## Architecture: Separation of Concerns

### CRITICAL: Never Mix Layers

One of the most common mistakes is mixing presentation logic with application code. **Templates, views, and frontend assets MUST NEVER be placed in `src/`**.

> **IMPORTANT:** The `src/` directory contains **ONLY** PHP code (classes, interfaces, traits). Templates, views, and assets belong in their dedicated directories.

### Correct Layer Separation

```text
Correct structure:
src/                          → PHP classes only
  ├─ Action/                  → HTTP request handlers
  ├─ Domain/                  → Business logic
  ├─ Middleware/              → PSR-15 middleware
  └─ Twig/                    → Twig extensions (PHP classes)

templates/                    → Twig/PHP templates (.twig, .php)
  ├─ layout/
  ├─ user/
  └─ _partials/

public/assets/                → Compiled frontend assets
  ├─ css/
  ├─ js/
  └─ images/

resources/                    → Source assets (before compilation)
  ├─ css/
  └─ js/

Incorrect structure:
src/
  ├─ Action/
  ├─ Domain/
  └─ Templates/              ← NEVER DO THIS
      └─ user.html.twig      ← TEMPLATES DON'T BELONG IN src/
```

### Why This Separation Matters

**1. Clear Responsibilities:**
- `src/` = **Application logic** (PHP classes that DO things)
- `templates/` = **Presentation logic** (How things are displayed)
- `public/assets/` = **Static resources** (CSS, JS, images)
- `resources/` = **Source assets** (Pre-compilation)

**2. Autoloading:**
- PSR-4 autoloader expects **only** PHP classes in `src/`
- Templates are loaded by the template engine (Twig, PHP-View)
- Mixing them breaks autoloading conventions

**3. Security:**
- `src/` is **never** directly accessible via HTTP
- `templates/` is **never** directly accessible via HTTP
- Only `public/` directory is exposed to the web server

**4. Maintainability:**
- Frontend developers work in `templates/` and `resources/`
- Backend developers work in `src/`
- Clear separation = better collaboration

### Architecture Layers Explained

```text
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  (templates/, public/assets/, resources/)               │
│  • HTML/Twig templates                                   │
│  • CSS, JavaScript                                       │
│  • Images, fonts                                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   APPLICATION LAYER                      │
│  (src/Action/, src/Middleware/, src/Handler/)           │
│  • HTTP request handling                                 │
│  • Request/Response transformation                       │
│  • Middleware pipeline                                   │
│  • Error handling                                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                     DOMAIN LAYER                         │
│  (src/Domain/)                                           │
│  • Business logic                                        │
│  • Entities, Value Objects                              │
│  • Domain services                                       │
│  • Business rules & validation                          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                     │
│  (src/Infrastructure/)                                   │
│  • Database repositories                                 │
│  • External API clients                                  │
│  • Email, cache, queue services                         │
│  • Third-party integrations                             │
└─────────────────────────────────────────────────────────┘
```

### Real-World Example

**Wrong - Mixing Layers:**
```php
<?php
// src/Action/User/ViewUserAction.php - BAD!

namespace App\Action\User;

class ViewUserAction
{
    public function __invoke($request, $response)
    {
        $userId = $request->getAttribute('id');

        // BAD: Business logic in Action
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        // BAD: HTML in PHP code
        $html = "<html><body><h1>{$user['name']}</h1></body></html>";
        $response->getBody()->write($html);

        return $response;
    }
}
```

**Correct - Proper Separation:**
```php
<?php
// src/Action/User/ViewUserAction.php - GOOD!

declare(strict_types=1);

namespace App\Action\User;

use App\Domain\User\Repository\UserRepositoryInterface;
use Slim\Views\Twig;

final readonly class ViewUserAction
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private Twig $twig,
    ) {}

    public function __invoke($request, $response, array $args)
    {
        $userId = (int) $args['id'];

        // Delegate to Domain layer
        $user = $this->repository->find($userId);

        if (!$user) {
            throw new HttpNotFoundException($request);
        }

        // Render using template (Presentation layer)
        return $this->twig->render($response, 'user/profile.html.twig', [
            'user' => $user,
        ]);
    }
}
```

```twig
{# templates/user/profile.html.twig - Presentation layer #}
{% extends 'layout/base.html.twig' %}

{% block content %}
    <h1>{{ user.name }}</h1>
    <p>Email: {{ user.email }}</p>
{% endblock %}
```

```php
<?php
// src/Domain/User/Repository/UserRepository.php - Domain layer

declare(strict_types=1);

namespace App\Domain\User\Repository;

use App\Domain\User\Entity\User;

final readonly class UserRepository implements UserRepositoryInterface
{
    public function __construct(
        private \PDO $pdo,
    ) {}

    public function find(int $id): ?User
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        return $row ? $this->hydrate($row) : null;
    }

    private function hydrate(array $row): User
    {
        return new User(
            id: (int) $row['id'],
            email: $row['email'],
            name: $row['name'],
        );
    }
}
```

### Key Takeaways

**Recommended:**
- Place templates in `templates/`
- Place compiled assets in `public/assets/`
- Place source assets in `resources/`
- Place PHP classes in `src/`
- Keep layers independent and well-defined

**Not recommended:**
- Put templates in `src/`
- Put business logic in Actions
- Put HTML in PHP classes
- Put database queries in Actions
- Mix presentation with business logic

## Configuration

### Use Environment Variables for Infrastructure Configuration

The values of infrastructure options change from one machine to another (e.g., from your development machine to the production server), but they don't modify the application behavior.

Use environment variables to define these options. Create a `.env` file for local development and use server environment variables in production:

```bash
# .env
DATABASE_HOST=localhost
DATABASE_NAME=myapp
DATABASE_USER=root
DATABASE_PASSWORD=secret
REDIS_HOST=127.0.0.1
SMTP_HOST=smtp.example.com
```

Load these variables using a library like [vlucas/phpdotenv](https://github.com/vlucas/phpdotenv):

```php
<?php
// public/index.php

use DI\Container;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Create container and app
$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();
```

**Never commit** your `.env` file to version control. Instead, commit a `.env.example` file with dummy values.

### Use Settings for Application Configuration

Application configuration consists of options that modify the application behavior, such as the number of items per page, email sender address, or feature flags. Their values don't change per machine.

Define these settings in a dedicated configuration file:

```php
<?php
// config/settings.php

return [
    'settings' => [
        'displayErrorDetails' => false,
        'logErrors' => true,
        'logErrorDetails' => false,

        // Application settings
        'app' => [
            'name' => 'My Slim Application',
            'url' => 'https://example.com',
            'timezone' => 'UTC',
        ],

        // Pagination
        'pagination' => [
            'items_per_page' => 20,
            'max_items_per_page' => 100,
        ],

        // Email
        'email' => [
            'from_address' => 'noreply@example.com',
            'from_name' => 'My Application',
        ],

        // Database (using env vars for sensitive data)
        'database' => [
            'host' => $_ENV['DATABASE_HOST'],
            'database' => $_ENV['DATABASE_NAME'],
            'username' => $_ENV['DATABASE_USER'],
            'password' => $_ENV['DATABASE_PASSWORD'],
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
        ],
    ],
];
```

### Use Short and Prefixed Setting Names

Consider using a consistent prefix for your settings to avoid collisions with third-party packages. Use only one or two words to describe the purpose:

```php
// Good: short but meaningful names
'app.name' => 'My Application',
'app.timezone' => 'UTC',
'pagination.items_per_page' => 20,
'email.from_address' => 'noreply@example.com',

// Bad: too generic
'name' => 'My Application',
'items' => 20,
```

### Use Constants to Define Options that Rarely Change

Configuration options like the number of items to display in a listing rarely change. Instead of defining them as settings, define them as PHP constants in the related classes:

```php
<?php
// src/Domain/Post/Entity/Post.php

declare(strict_types=1);

namespace App\Domain\Post\Entity;

final readonly class Post
{
    public const POSTS_PER_PAGE = 10;
    public const MAX_TITLE_LENGTH = 255;
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PUBLISHED = 'published';

    // ...
}
```

The main advantage is that you can use them everywhere, including templates and domain entities, whereas settings require access to the container.

## Business Logic

### Organize Business Logic by Domain

Instead of organizing your application by technical layers (controllers, services, repositories), organize by business domains:

```text
src/
├─ Domain/
│  ├─ User/
│  │  ├─ Entity/
│  │  │  └─ User.php
│  │  ├─ Repository/
│  │  │  └─ UserRepository.php
│  │  └─ Service/
│  │      ├─ UserCreator.php
│  │      └─ UserFinder.php
│  └─ Post/
│     ├─ Entity/
│     │  └─ Post.php
│     ├─ Repository/
│     │  └─ PostRepository.php
│     └─ Service/
│        ├─ PostCreator.php
│        └─ PostPublisher.php
```

This structure makes it easier to:
- Understand what the application does
- Find related code
- Maintain and refactor
- Extract domains into separate packages if needed

### Use Dependency Injection to Manage Services

Use a PSR-11 compatible dependency container like [PHP-DI](http://php-di.org/) to manage your application services:

```php
<?php
// config/dependencies.php

use App\Domain\User\Repository\UserRepository;
use App\Domain\User\Service\UserCreator;
use Psr\Container\ContainerInterface;

return [
    UserRepository::class => function (ContainerInterface $c) {
        return new UserRepository($c->get(PDO::class));
    },

    UserCreator::class => function (ContainerInterface $c) {
        return new UserCreator(
            $c->get(UserRepository::class)
        );
    },

    PDO::class => function (ContainerInterface $c) {
        $settings = $c->get('settings')['database'];

        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=%s',
            $settings['host'],
            $settings['database'],
            $settings['charset']
        );

        return new PDO(
            $dsn,
            $settings['username'],
            $settings['password'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    },
];
```

### Use Autowiring When Possible

If using PHP-DI, enable autowiring to reduce boilerplate configuration:

```php
<?php
// config/container.php

use DI\Container;
use DI\ContainerBuilder;

$containerBuilder = new ContainerBuilder();

// Enable autowiring
$containerBuilder->useAutowiring(true);

// Add definitions
$containerBuilder->addDefinitions(__DIR__ . '/dependencies.php');
$containerBuilder->addDefinitions(__DIR__ . '/settings.php');

return $containerBuilder->build();
```

With autowiring, you often don't need to explicitly configure services:

```php
<?php

namespace App\Domain\User\Service;

use App\Domain\User\Repository\UserRepository;

class UserCreator
{
    private UserRepository $repository;

    // PHP-DI will automatically inject UserRepository
    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createUser(string $email, string $password): User
    {
        // ...
    }
}
```

## Actions (Controllers)

### Use Single Action Controllers

Instead of creating controller classes with multiple methods, use single-action classes (also called Action classes or Request Handlers). Each action handles a single route:

```php
<?php
// src/Action/User/CreateUserAction.php

namespace App\Action\User;

use App\Domain\User\Service\UserCreator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final readonly class CreateUserAction
{
    public function __construct(
        private UserCreator $userCreator,
    ) {}

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = (array) $request->getParsedBody();

        $user = $this->userCreator->createUser(
            $data['email'],
            $data['password']
        );

        $response->getBody()->write(
            json_encode(['id' => $user->getId()], JSON_THROW_ON_ERROR)
        );

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
```

Benefits of single-action controllers:
- **Single Responsibility Principle**: Each class does one thing
- **Easy to test**: Minimal setup required
- **Clear naming**: Action name describes exactly what it does
- **Easy dependency injection**: Only inject what this action needs

### Define Routes in a Separate File

Keep your routing configuration separate from your application bootstrap:

```php
<?php
// config/routes.php

use App\Action\User\CreateUserAction;
use App\Action\User\ListUsersAction;
use App\Action\User\ViewUserAction;
use Slim\App;

return function (App $app) {
    // API routes
    $app->group('/api', function ($group) {
        // User routes
        $group->get('/users', ListUsersAction::class);
        $group->post('/users', CreateUserAction::class);
        $group->get('/users/{id}', ViewUserAction::class);
    });
};
```

Then load it in your bootstrap file:

```php
<?php
// public/index.php

$app = AppFactory::create();

// ... middleware configuration ...

// Load routes
$routes = require __DIR__ . '/../config/routes.php';
$routes($app);

$app->run();
```

### Use Dependency Injection in Actions

Actions should receive their dependencies via constructor injection. With **PHP 8.4**, leverage modern features like constructor property promotion and readonly classes:

```php
<?php

declare(strict_types=1);

namespace App\Action\Post;

use App\Domain\Post\Service\PostFinder;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Lists all posts in the system.
 */
final readonly class ListPostsAction
{
    /**
     * @param PostFinder $postFinder Service to find posts
     */
    public function __construct(
        private PostFinder $postFinder,
    ) {}

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $posts = $this->postFinder->findAll();

        $response->getBody()->write(
            json_encode($posts, JSON_THROW_ON_ERROR)
        );

        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}
```

**PHP 8.4 Benefits:**
- `declare(strict_types=1);` - Enforce strict type checking
- `readonly class` - Immutability by default, safer code
- Constructor property promotion - Less boilerplate
- Trailing comma in parameter lists - Easier to add parameters

For comprehensive PHP 8.4 feature examples and guidelines (union types, match expressions, named arguments, nullsafe operator, etc.), see the [PHP 8.4 Specific Features section in Coding Standards](/docs/v4/cookbook/coding-standards.html#php-84-specific-features).

**Never** access the container directly in your actions. This couples your code to the container implementation.

## Middleware

### Use Middleware for Cross-Cutting Concerns

Middleware is perfect for handling concerns that apply to multiple routes:

- Authentication and authorization
- CORS headers
- Request validation
- Response transformation
- Logging and monitoring

### Use PSR-15 Middleware Standard

Implement the `Psr\Http\Server\MiddlewareInterface` for standardized, reusable middleware that works across PSR-15 compatible frameworks:

```php
<?php
// src/Middleware/AuthenticationMiddleware.php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;

class AuthenticationMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $responseFactory;

    public function __construct(ResponseFactoryInterface $responseFactory)
    {
        $this->responseFactory = $responseFactory;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $token = $request->getHeaderLine('Authorization');

        if (empty($token)) {
            $response = $this->responseFactory->createResponse();
            $response->getBody()->write(
                json_encode(['error' => 'Unauthorized'])
            );
            return $response
                ->withStatus(401)
                ->withHeader('Content-Type', 'application/json');
        }

        // Validate token and add user to request
        $user = $this->validateToken($token);
        $request = $request->withAttribute('user', $user);

        return $handler->handle($request);
    }

    private function validateToken(string $token): ?object
    {
        // Token validation logic here
        return null;
    }
}
```

### Order Your Middleware Correctly (LIFO)

**IMPORTANT:** Slim processes middleware in **LIFO** (Last In, First Out) order. The last middleware added is the **first** to be executed.

The routing middleware should be added **before** the error middleware to ensure routing exceptions are handled properly:

```php
<?php
// config/middleware.php

use App\Middleware\AuthenticationMiddleware;
use App\Middleware\CorsMiddleware;
use Slim\App;

return function (App $app) {
    // LIFO: This executes FIRST (last added)
    // Error middleware (should be added last)
    $app->addErrorMiddleware(true, true, true);

    // Custom middleware (executes second)
    $app->add(AuthenticationMiddleware::class);
    $app->add(CorsMiddleware::class);

    // Routing middleware (executes third)
    $app->addRoutingMiddleware();

    // Body parsing (executes LAST - first added)
    $app->addBodyParsingMiddleware();
};
```

**Execution order:**
1. BodyParsingMiddleware (parses request body)
2. RoutingMiddleware (determines route)
3. CorsMiddleware (adds CORS headers)
4. AuthenticationMiddleware (validates user)
5. ErrorMiddleware (catches exceptions)

### Use Route-Specific Middleware When Appropriate

Not all routes need the same middleware. Apply middleware only where needed:

```php
<?php
// config/routes.php

use App\Middleware\AuthenticationMiddleware;
use Slim\App;

return function (App $app) {
    // Public routes (no authentication)
    $app->get('/health', HealthCheckAction::class);
    $app->post('/login', LoginAction::class);

    // Protected routes (with authentication)
    $app->group('/api', function ($group) {
        $group->get('/users', ListUsersAction::class);
        $group->get('/posts', ListPostsAction::class);
    })->add(AuthenticationMiddleware::class);

    // Admin routes (with extra authorization)
    $app->group('/admin', function ($group) {
        $group->get('/users', AdminListUsersAction::class);
    })->add(AuthorizationMiddleware::class)
      ->add(AuthenticationMiddleware::class);
};
```

### Pass Data Between Middleware and Actions

Use request attributes to pass data from middleware to actions:

```php
<?php
// In middleware
$request = $request->withAttribute('user', $user);
$request = $request->withAttribute('permissions', $permissions);

return $handler->handle($request);

// In action
public function __invoke(
    ServerRequestInterface $request,
    ResponseInterface $response
): ResponseInterface {
    $user = $request->getAttribute('user');
    $permissions = $request->getAttribute('permissions');

    // Use the data...
}
```

## Templates

### Use Twig for Server-Side Rendering

If your application renders HTML, use [Twig](https://twig.symfony.com/) as your template engine:

```bash
composer require slim/twig-view
```

Configure it in your container:

```php
<?php
// config/dependencies.php

use Slim\Views\Twig;
use Psr\Container\ContainerInterface;

return [
    Twig::class => function (ContainerInterface $c) {
        return Twig::create(
            __DIR__ . '/../templates',
            ['cache' => __DIR__ . '/../var/cache/twig']
        );
    },
];
```

### Use Snake Case for Template Names

Use lowercase snake_case for template names and variables:

```php
// Good
user_profile.html.twig
post/edit_form.html.twig
{{ user_name }}

// Bad
UserProfile.html.twig
post/EditForm.html.twig
{{ userName }}
```

### Prefix Template Fragments with an Underscore

Partial templates (fragments included in other templates) should be prefixed with an underscore:

```twig
{# templates/_pagination.html.twig #}
<nav>
    {% if current_page > 1 %}
        <a href="?page={{ current_page - 1 }}">Previous</a>
    {% endif %}

    <span>Page {{ current_page }} of {{ total_pages }}</span>

    {% if current_page < total_pages %}
        <a href="?page={{ current_page + 1 }}">Next</a>
    {% endif %}
</nav>
```

```twig
{# templates/posts/list.html.twig #}
{% for post in posts %}
    <article>{{ post.title }}</article>
{% endfor %}

{% include '_pagination.html.twig' %}
```

## Validation

### Use Respect/Validation for Input Validation

**Slim 4 doesn't have built-in validation**. Use [Respect/Validation](https://respect-validation.readthedocs.io/), the de facto standard for Slim applications:

```bash
composer require respect/validation
```

### Option 1: Validation in Services (Recommended)

Place validation in your service/business logic layer:

```php
<?php
// src/Domain/User/Service/UserCreator.php

declare(strict_types=1);

namespace App\Domain\User\Service;

use App\Domain\User\Data\User;
use App\Domain\User\Repository\UserRepositoryInterface;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

final readonly class UserCreator
{
    public function __construct(
        private UserRepositoryInterface $repository,
    ) {}

    public function create(array $data): User
    {
        // Validate input
        $this->validate($data);

        // Business logic
        $user = new User(
            email: $data['email'],
            name: $data['name'],
            passwordHash: password_hash($data['password'], PASSWORD_DEFAULT),
        );

        return $this->repository->save($user);
    }

    private function validate(array $data): void
    {
        v::key('email', v::email()->notEmpty())
            ->key('password', v::stringType()->length(8, null))
            ->key('name', v::stringType()->length(2, 100))
            ->assert($data);
    }
}
```

### Option 2: Dedicated Validator Classes

For complex validation, create dedicated validator classes in `Helper/`:

```php
<?php
// src/Helper/ValidationHelper.php

declare(strict_types=1);

namespace App\Helper;

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

final class ValidationHelper
{
    /**
     * Validates user creation data.
     *
     * @throws ValidationException
     */
    public function validateUserCreate(array $data): void
    {
        v::key('email', v::email()->notEmpty())
            ->key('password', v::stringType()->length(8, 100))
            ->key('name', v::stringType()->length(2, 100))
            ->assert($data);
    }

    /**
     * Validates user update data.
     *
     * @throws ValidationException
     */
    public function validateUserUpdate(array $data): void
    {
        v::key('email', v::optional(v::email()), false)
            ->key('name', v::optional(v::stringType()->length(2, 100)), false)
            ->assert($data);
    }

    /**
     * Validates and returns errors as array.
     *
     * @return array Empty array if valid, errors array otherwise
     */
    public function check(callable $validationCallback): array
    {
        try {
            $validationCallback();
            return [];
        } catch (ValidationException $e) {
            return $e->getMessages();
        }
    }
}
```

Use it in your action:

```php
<?php
// src/Action/User/CreateUserAction.php

declare(strict_types=1);

namespace App\Action\User;

use App\Domain\User\Service\UserCreator;
use App\Helper\ValidationHelper;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Respect\Validation\Exceptions\ValidationException;

final readonly class CreateUserAction
{
    public function __construct(
        private UserCreator $userCreator,
        private ValidationHelper $validator,
    ) {}

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = (array) $request->getParsedBody();

        try {
            $this->validator->validateUserCreate($data);
            $user = $this->userCreator->create($data);

            $response->getBody()->write(
                json_encode(['id' => $user->getId()], JSON_THROW_ON_ERROR)
            );

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(201);

        } catch (ValidationException $e) {
            $response->getBody()->write(
                json_encode([
                    'error' => 'Validation failed',
                    'details' => $e->getMessages(),
                ], JSON_THROW_ON_ERROR)
            );

            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(422);
        }
    }
}
```

### Option 3: Validation Middleware

For route-specific validation, use middleware:

```php
<?php
// src/Middleware/ValidationMiddleware.php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

final readonly class UserCreateValidationMiddleware implements MiddlewareInterface
{
    public function __construct(
        private ResponseFactoryInterface $responseFactory,
    ) {}

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $data = (array) $request->getParsedBody();

        try {
            v::key('email', v::email()->notEmpty())
                ->key('password', v::stringType()->length(8, null))
                ->key('name', v::stringType()->length(2, 100))
                ->assert($data);

            return $handler->handle($request);

        } catch (ValidationException $e) {
            $response = $this->responseFactory->createResponse(422);
            $response->getBody()->write(
                json_encode([
                    'error' => 'Validation failed',
                    'details' => $e->getMessages(),
                ], JSON_THROW_ON_ERROR)
            );

            return $response->withHeader('Content-Type', 'application/json');
        }
    }
}
```

Apply to specific routes:

```php
<?php
// config/routes/api.php

use App\Middleware\UserCreateValidationMiddleware;

return function (App $app) {
    $app->post('/api/users', CreateUserAction::class)
        ->add(UserCreateValidationMiddleware::class);
};
```

### Common Validation Rules

```php
<?php

use Respect\Validation\Validator as v;

// Email
v::email()->validate('user@example.com');

// Required string with length
v::stringType()->notEmpty()->length(2, 100)->validate('John');

// Integer with range
v::intVal()->between(1, 100)->validate(50);

// Optional field
v::optional(v::email())->validate(null);  // Valid
v::optional(v::email())->validate('test@example.com');  // Valid

// URL
v::url()->validate('https://example.com');

// Date
v::date('Y-m-d')->validate('2024-10-21');

// Array of items
v::arrayType()->each(v::intVal())->validate([1, 2, 3]);

// Custom validation
v::callback(function($value) {
    return strlen($value) > 0;
})->validate('test');
```

### Best Practices

**Recommended:**
- Validate in the service/business layer
- Return 422 status for validation errors
- Use dedicated validator classes for complex rules
- Provide clear, specific error messages

**Not recommended:**
- Write custom validation logic (use Respect/Validation)
- Validate in Actions (keep them thin)
- Trust user input without validation
- Return generic error messages

## Database and ORM

### Use an ORM for Complex Applications

For applications with complex data models, use an ORM like [Doctrine ORM](https://www.doctrine-project.org/) or [Eloquent](https://laravel.com/docs/eloquent):

```bash
composer require doctrine/orm
composer require symfony/cache
```

See the [Doctrine cookbook](/docs/v4/cookbook/database-doctrine.html) for setup instructions.

### Use the Repository Pattern

Encapsulate data access logic in repository classes:

```php
<?php
// src/Domain/User/Repository/UserRepository.php

namespace App\Domain\User\Repository;

use App\Domain\User\Data\User;

class UserRepository
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findById(int $id): ?User
    {
        $stmt = $this->pdo->prepare(
            'SELECT * FROM users WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? $this->hydrate($row) : null;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->query('SELECT * FROM users');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $rows);
    }

    public function insert(User $user): int
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO users (email, name, password_hash)
             VALUES (:email, :name, :password_hash)'
        );

        $stmt->execute([
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'password_hash' => $user->getPasswordHash(),
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    private function hydrate(array $row): User
    {
        // Map database row to entity
        return new User(
            (int) $row['id'],
            $row['email'],
            $row['name'],
            $row['password_hash']
        );
    }
}
```

## Error Handling

### Use Custom Error Handlers

Create custom error handlers for different types of errors:

```php
<?php
// src/Handler/HttpErrorHandler.php

namespace App\Handler;

use Psr\Http\Message\ResponseInterface;
use Slim\Exception\HttpException;
use Slim\Handlers\ErrorHandler;

class HttpErrorHandler extends ErrorHandler
{
    protected function respond(): ResponseInterface
    {
        $exception = $this->exception;
        $statusCode = 500;
        $message = 'Internal Server Error';

        if ($exception instanceof HttpException) {
            $statusCode = $exception->getCode();
            $message = $exception->getMessage();
        }

        $error = [
            'error' => [
                'message' => $message,
                'code' => $statusCode,
            ],
        ];

        // Don't expose sensitive details in production
        if ($this->displayErrorDetails) {
            $error['error']['details'] = [
                'type' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        $payload = json_encode($error, JSON_PRETTY_PRINT);
        $response = $this->responseFactory->createResponse($statusCode);

        $response->getBody()->write($payload);

        return $response
            ->withHeader('Content-Type', 'application/json');
    }
}
```

Register it:

```php
<?php
// public/index.php

use App\Handler\HttpErrorHandler;

$errorMiddleware = $app->addErrorMiddleware(
    displayErrorDetails: false,  // Set to false in production
    logErrors: true,             // Always log errors
    logErrorDetails: true        // Log full error details
);

$errorHandler = $errorMiddleware->getDefaultErrorHandler();
$errorHandler->registerErrorRenderer('application/json', HttpErrorHandler::class);
```

### Use HTTP Exceptions

Slim 4 provides specific HTTP exception classes for common error scenarios:

```php
<?php

use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpMethodNotAllowedException;
use Slim\Exception\HttpInternalServerErrorException;

// In your action
public function __invoke(
    ServerRequestInterface $request,
    ResponseInterface $response
): ResponseInterface {
    $id = $request->getAttribute('id');
    $user = $this->repository->find($id);

    if (!$user) {
        throw new HttpNotFoundException($request, 'User not found');
    }

    if (!$this->hasPermission($request->getAttribute('user'), $user)) {
        throw new HttpForbiddenException($request, 'Access denied');
    }

    // Process request...
}
```

### Log All Errors with Monolog (PSR-3)

**Always** log errors, even in production. Use Monolog for PSR-3 compliant logging:

```bash
composer require monolog/monolog
```

```php
<?php
// config/dependencies.php

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\RotatingFileHandler;
use Monolog\Formatter\LineFormatter;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;

return [
    LoggerInterface::class => function (ContainerInterface $c) {
        $settings = $c->get('settings');
        $logger = new Logger('app');

        // Use RotatingFileHandler for automatic log rotation
        $handler = new RotatingFileHandler(
            __DIR__ . '/../var/log/app.log',
            30, // Keep logs for 30 days
            Logger::DEBUG
        );

        // Custom format for better readability
        $formatter = new LineFormatter(
            "[%datetime%] %channel%.%level_name%: %message% %context%\n",
            'Y-m-d H:i:s'
        );
        $handler->setFormatter($formatter);

        $logger->pushHandler($handler);

        return $logger;
    },
];
```

### Use Appropriate Log Levels

PSR-3 defines 8 log levels. Use them wisely:

```php
<?php

use Psr\Log\LoggerInterface;

class UserService
{
    private LoggerInterface $logger;

    public function createUser(array $data): User
    {
        // DEBUG: Detailed debug information
        $this->logger->debug('Creating user', ['email' => $data['email']]);

        // INFO: Interesting events
        $this->logger->info('User created successfully', ['userId' => $user->getId()]);

        // NOTICE: Normal but significant events
        $this->logger->notice('New user registration', ['userId' => $user->getId()]);

        // WARNING: Exceptional occurrences that are not errors
        $this->logger->warning('User email not verified', ['userId' => $user->getId()]);

        // ERROR: Runtime errors that don't require immediate action
        $this->logger->error('Failed to send welcome email', [
            'userId' => $user->getId(),
            'error' => $e->getMessage()
        ]);

        // CRITICAL: Critical conditions
        $this->logger->critical('Database connection lost');

        // ALERT: Action must be taken immediately
        $this->logger->alert('Payment gateway unreachable');

        // EMERGENCY: System is unusable
        $this->logger->emergency('Application crashed');

        return $user;
    }
}
```

### Keep Logs Concise and Meaningful

**Good logging practices:**

```php
<?php
// Good: Descriptive with context
$this->logger->error('Failed to process payment', [
    'orderId' => $orderId,
    'amount' => $amount,
    'error' => $e->getMessage(),
    'userId' => $userId
]);

// Good: Action-oriented
$this->logger->info('User login successful', [
    'userId' => $user->getId(),
    'ip' => $request->getServerParams()['REMOTE_ADDR']
]);

// Bad: Too vague
$this->logger->error('Error occurred');

// Bad: Too much information
$this->logger->debug('Data: ' . print_r($hugeArray, true));
```

## Security

### Hash Passwords Properly

Always use `password_hash()` and `password_verify()` for password handling:

```php
<?php

namespace App\Domain\User\Service;

class UserCreator
{
    public function createUser(string $email, string $plainPassword): User
    {
        // Hash password using bcrypt
        $passwordHash = password_hash(
            $plainPassword,
            PASSWORD_DEFAULT
        );

        // Create user with hashed password
        $user = new User($email, $passwordHash);

        return $this->repository->insert($user);
    }
}

class UserAuthenticator
{
    public function authenticate(string $email, string $plainPassword): ?User
    {
        $user = $this->repository->findByEmail($email);

        if (!$user) {
            return null;
        }

        // Verify password
        if (!password_verify($plainPassword, $user->getPasswordHash())) {
            return null;
        }

        return $user;
    }
}
```

### Use JWT for API Authentication

For API authentication, use JSON Web Tokens (JWT):

```bash
composer require firebase/php-jwt
```

```php
<?php

namespace App\Domain\Auth\Service;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    private string $secretKey;
    private string $algorithm = 'HS256';

    public function __construct(string $secretKey)
    {
        $this->secretKey = $secretKey;
    }

    public function createToken(int $userId): string
    {
        $payload = [
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24), // 24 hours
            'userId' => $userId,
        ];

        return JWT::encode($payload, $this->secretKey, $this->algorithm);
    }

    public function verifyToken(string $token): ?object
    {
        try {
            return JWT::decode(
                $token,
                new Key($this->secretKey, $this->algorithm)
            );
        } catch (\Exception $e) {
            return null;
        }
    }
}
```

### Validate and Sanitize User Input

Always validate and sanitize user input:

```php
<?php

use Respect\Validation\Validator as v;

// Validate email
v::email()->validate($email);

// Sanitize HTML
$clean = htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// Validate integer
v::intVal()->validate($id);

// Validate URL
v::url()->validate($url);
```

### Use HTTPS in Production

Always use HTTPS in production. You can enforce it with middleware:

```php
<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class HttpsMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $uri = $request->getUri();

        if ($uri->getScheme() !== 'https') {
            $response = new Response();

            $httpsUri = $uri->withScheme('https')->withPort(443);

            return $response
                ->withStatus(301)
                ->withHeader('Location', (string) $httpsUri);
        }

        return $handler->handle($request);
    }
}
```

## Testing

### Install PHPUnit

Use [PHPUnit](https://phpunit.de/) to test your Slim 4 application:

```bash
composer require --dev phpunit/phpunit
```

### Test Directory Structure

Organize your tests following this proven structure:

```text
tests/
├─ bootstrap.php           # Test bootstrap with middleware mocking
├─ TestCase.php            # Base test case with common helpers
├─ Functional/
│  ├─ AuthTestHelper.php   # Authentication simulation helper
│  ├─ HomepageTest.php     # Public interface and navigation tests
│  ├─ CriticalRoutesTest.php  # Essential APIs and business routes
│  └─ ...
└─ Unit/
   ├─ Domain/
   │  └─ User/
   │     └─ Service/
   │        └─ UserCreatorTest.php
   └─ ...
```

### PHPUnit Configuration

Create `phpunit.xml` at your project root:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/10.1/phpunit.xsd"
         bootstrap="tests/bootstrap.php"
         colors="true"
         stopOnError="false"
         stopOnFailure="false"
         cacheDirectory=".phpunit.cache"
         backupGlobals="false"
         displayDetailsOnIncompleteTests="true"
         displayDetailsOnSkippedTests="true"
         beStrictAboutOutputDuringTests="false">

    <testsuites>
        <testsuite name="Application Test Suite">
            <directory suffix="Test.php">tests</directory>
        </testsuite>
    </testsuites>

    <php>
        <ini name="display_errors" value="-1"/>
        <ini name="error_reporting" value="-1"/>
        <ini name="memory_limit" value="512M"/>
        <env name="APP_ENV" value="testing" force="true"/>
        <env name="ENV" value="testing" force="true"/>
    </php>
</phpunit>
```

### Test Bootstrap: Mock Middleware for Isolation

Create `tests/bootstrap.php` to mock authentication and CSRF middleware:

```php
<?php

require dirname(__DIR__) . '/vendor/autoload.php';

// Start session for tests (like in public/index.php)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Mock middleware to bypass authentication in tests
spl_autoload_register(function ($class) {
    if ($class === 'App\\Middleware\\AuthMiddleware') {
        eval('
        namespace App\\Middleware;

        use Psr\\Http\\Message\\ResponseInterface;
        use Psr\\Http\\Message\\ServerRequestInterface;
        use Psr\\Http\\Server\\MiddlewareInterface;
        use Psr\\Http\\Server\\RequestHandlerInterface;
        use Slim\\Psr7\\Response;

        class AuthMiddleware implements MiddlewareInterface
        {
            public function process(
                ServerRequestInterface $request,
                RequestHandlerInterface $handler
            ): ResponseInterface {
                // In test mode, check if user is authenticated via session
                if (!isset($_SESSION[\'user\']) || empty($_SESSION[\'user\'])) {
                    $response = new Response();
                    return $response
                        ->withHeader(\'Location\', \'/login\')
                        ->withStatus(302);
                }

                return $handler->handle($request);
            }
        }
        ');
        return true;
    }

    if ($class === 'App\\Middleware\\CsrfMiddleware') {
        eval('
        namespace App\\Middleware;

        use Psr\\Http\\Message\\ResponseInterface;
        use Psr\\Http\\Message\\ServerRequestInterface;
        use Psr\\Http\\Server\\MiddlewareInterface;
        use Psr\\Http\\Server\\RequestHandlerInterface;

        class CsrfMiddleware implements MiddlewareInterface
        {
            public function process(
                ServerRequestInterface $request,
                RequestHandlerInterface $handler
            ): ResponseInterface {
                // In test mode, bypass CSRF validation
                return $handler->handle($request);
            }
        }
        ');
        return true;
    }

    return false;
}, true, true); // Prepend = true to be called first
```

### Base TestCase: Shared App Instance and Helpers

Create `tests/TestCase.php` for shared functionality:

```php
<?php

declare(strict_types=1);

namespace Tests;

use DI\ContainerBuilder;
use PHPUnit\Framework\TestCase as PHPUnit_TestCase;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Headers;
use Slim\Psr7\Request as SlimRequest;
use Slim\Psr7\Uri;

class TestCase extends PHPUnit_TestCase
{
    /**
     * Clean session between tests to ensure isolation
     */
    protected function tearDown(): void
    {
        $_SESSION = [];
        parent::tearDown();
    }

    /**
     * Create the Slim application instance for testing
     */
    protected function getAppInstance(): App
    {
        // Instantiate PHP-DI ContainerBuilder
        $containerBuilder = new ContainerBuilder();
        $rootPath = realpath(dirname(__DIR__, 1));

        // Build PHP-DI Container instance
        $container = $containerBuilder->build();

        // Instantiate the app
        AppFactory::setContainer($container);
        $app = AppFactory::create();
        $app->addRoutingMiddleware();
        $app->addBodyParsingMiddleware();

        // Load application configuration
        require $rootPath . '/config/container.php';
        require $rootPath . '/config/middleware.php';
        require $rootPath . '/config/routes.php';

        return $app;
    }

    /**
     * Create a PSR-7 request for testing
     *
     * @param string $method HTTP method (GET, POST, PUT, DELETE, etc.)
     * @param string $path Request path (can include query string)
     * @param array $headers HTTP headers
     * @param array $cookies Cookies
     * @param array $serverParams Server parameters
     */
    protected function createRequest(
        string $method,
        string $path,
        array $headers = ['HTTP_ACCEPT' => 'text/html'],
        array $cookies = [],
        array $serverParams = []
    ): Request {
        // Separate path and query string
        $parts = parse_url($path);
        $pathOnly = $parts['path'] ?? $path;
        $query = $parts['query'] ?? '';

        $uri = new Uri('', '', 80, $pathOnly, $query);
        $handle = fopen('php://temp', 'w+');
        $stream = (new StreamFactory())->createStreamFromResource($handle);

        $h = new Headers();
        foreach ($headers as $name => $value) {
            $h->addHeader($name, $value);
        }

        return new SlimRequest($method, $uri, $h, $cookies, $serverParams, $stream);
    }
}
```

### Authentication Test Helper

Create `tests/Functional/AuthTestHelper.php` to simulate different user profiles:

```php
<?php

declare(strict_types=1);

namespace Tests\Functional;

/**
 * Helper to simulate different user profiles in tests
 */
class AuthTestHelper
{
    /**
     * Simulate a user session with specific permissions
     */
    public static function loginAs(array $rights): void
    {
        $_SESSION['user'] = 'test.user@example.com';
        $_SESSION['permissions'] = $rights;
    }

    /**
     * Simulate a full admin user
     */
    public static function loginAsAdmin(): void
    {
        self::loginAs(['admin', 'users', 'posts', 'analytics']);
    }

    /**
     * Simulate a basic user with limited permissions
     */
    public static function loginAsBasicUser(): void
    {
        self::loginAs(['posts']);
    }

    /**
     * Simulate an unauthorized user (no permissions)
     */
    public static function loginAsUnauthorizedUser(): void
    {
        self::loginAs([]);
    }

    /**
     * Log out the user
     */
    public static function logout(): void
    {
        unset($_SESSION['user']);
        unset($_SESSION['permissions']);
    }

    /**
     * Check if user has a specific permission
     */
    public static function hasPermission(string $permission): bool
    {
        return isset($_SESSION['permissions'])
            && in_array($permission, $_SESSION['permissions']);
    }

    /**
     * Automatically login with appropriate profile based on route
     */
    public static function loginForRoute(string $route): bool
    {
        $requiredPermission = self::getRequiredPermission($route);

        if ($requiredPermission === null) {
            // Public route, no authentication needed
            return true;
        }

        // Map permissions to required rights
        $permissionMap = [
            'admin' => ['admin', 'users', 'posts', 'analytics'],
            'posts' => ['posts'],
            'users' => ['users'],
        ];

        if (isset($permissionMap[$requiredPermission])) {
            self::loginAs($permissionMap[$requiredPermission]);
            return true;
        }

        return false;
    }

    /**
     * Determine required permission for a route
     */
    private static function getRequiredPermission(string $route): ?string
    {
        // Public routes (no authentication required)
        $publicRoutes = [
            '/api/public/',
            '/health',
        ];

        foreach ($publicRoutes as $publicPattern) {
            if (str_starts_with($route, $publicPattern)) {
                return null;
            }
        }

        // Administrative routes
        if (str_contains($route, '/admin/')) {
            return 'admin';
        }

        if (str_contains($route, '/api/users/')) {
            return 'users';
        }

        // Default: public route
        return null;
    }
}
```

### Functional Testing: Homepage and Public Routes

Create `tests/Functional/HomepageTest.php` for public interface testing:

```php
<?php

declare(strict_types=1);

namespace Tests\Functional;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Functional tests for main pages and public interface
 *
 * @group homepage
 * @group critical
 * @group public-interface
 */
class HomepageTest extends TestCase
{
    /**
     * Test homepage displays correctly
     *
     * @covers HomeController::index
     * @group critical
     */
    #[Test]
    public function testHomepageDisplays(): void
    {
        $app = $this->getAppInstance();
        $request = $this->createRequest('GET', '/');
        $response = $app->handle($request);

        $this->assertEquals(200, $response->getStatusCode(),
            'Homepage should return 200');

        $body = (string) $response->getBody();

        $this->assertNotEmpty($body, 'Response body should not be empty');
        $this->assertStringContainsString('<html', $body,
            'Response should contain valid HTML');
    }

    /**
     * Test public routes are accessible without authentication
     *
     * @param string $route URL to test
     * @param string $description Route description
     *
     * @dataProvider publicRoutesProvider
     * @group public
     */
    #[Test]
    #[DataProvider('publicRoutesProvider')]
    public function testPublicRoutesAccessible(string $route, string $description): void
    {
        $app = $this->getAppInstance();
        $request = $this->createRequest('GET', $route);
        $response = $app->handle($request);

        $statusCode = $response->getStatusCode();

        $this->assertEquals(200, $statusCode,
            "{$description} should be publicly accessible");

        $body = (string) $response->getBody();
        $this->assertNotEmpty($body, "{$description} should not return empty content");
    }

    /**
     * Provide public routes for testing
     */
    public static function publicRoutesProvider(): array
    {
        return [
            ['/', 'Homepage'],
            ['/about', 'About page'],
            ['/api/public/status', 'Public API status'],
        ];
    }

    /**
     * Test protected routes require authentication
     *
     * @param string $route URL to test
     * @param string $description Route description
     *
     * @dataProvider protectedRoutesProvider
     * @group security
     * @group authentication
     */
    #[Test]
    #[DataProvider('protectedRoutesProvider')]
    public function testProtectedRoutesRequireAuth(string $route, string $description): void
    {
        $app = $this->getAppInstance();

        // Don't login - test should redirect or return 401/403
        $request = $this->createRequest('GET', $route);
        $response = $app->handle($request);

        $this->assertContains($response->getStatusCode(), [302, 401, 403],
            "{$description} should require authentication");
    }

    /**
     * Provide protected routes for testing
     */
    public static function protectedRoutesProvider(): array
    {
        return [
            ['/admin', 'Admin dashboard'],
            ['/api/users', 'Users API'],
        ];
    }

    /**
     * Test 404 error handling
     *
     * @group error-handling
     */
    #[Test]
    public function testNotFoundHandling(): void
    {
        $app = $this->getAppInstance();
        $request = $this->createRequest('GET', '/route-that-does-not-exist');

        try {
            $response = $app->handle($request);
            $this->assertEquals(404, $response->getStatusCode());
        } catch (\Slim\Exception\HttpNotFoundException $e) {
            // Expected exception for 404
            $this->assertTrue(true, 'HttpNotFoundException thrown as expected');
        }
    }
}
```

### Functional Testing: Critical Routes and APIs

Create `tests/Functional/CriticalRoutesTest.php` for essential business routes:

```php
<?php

declare(strict_types=1);

namespace Tests\Functional;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Tests for critical business routes
 *
 * Covers essential APIs and endpoints that are critical
 * for the application's core functionality.
 *
 * @group critical
 * @group api
 */
class CriticalRoutesTest extends TestCase
{
    /**
     * Test critical JSON APIs
     *
     * @param string $route API endpoint
     * @param string $description API description
     *
     * @dataProvider jsonApiProvider
     * @group json
     * @group integration
     */
    #[Test]
    #[DataProvider('jsonApiProvider')]
    public function testJsonApis(string $route, string $description): void
    {
        $app = $this->getAppInstance();

        AuthTestHelper::loginForRoute($route);
        $request = $this->createRequest('GET', $route);
        $response = $app->handle($request);

        $this->assertEquals(200, $response->getStatusCode(), $description);

        // Verify it's valid JSON
        $body = (string) $response->getBody();
        if (!empty($body)) {
            $jsonData = json_decode($body, true);
            $this->assertNotNull($jsonData,
                "Response should be valid JSON for {$route}");
        }
    }

    /**
     * Provide critical JSON API endpoints
     */
    public static function jsonApiProvider(): array
    {
        return [
            ['/api/users/1', 'User API by ID'],
            ['/api/posts/1', 'Post API by ID'],
            ['/api/public/health', 'Health check API'],
        ];
    }

    /**
     * Test performance of critical routes
     *
     * Ensures critical routes respond within acceptable time
     *
     * @group performance
     */
    #[Test]
    public function testCriticalRoutesPerformance(): void
    {
        $app = $this->getAppInstance();
        $routes = [
            '/',
            '/api/users/1',
        ];

        foreach ($routes as $route) {
            $start = microtime(true);

            AuthTestHelper::loginForRoute($route);
            $request = $this->createRequest('GET', $route);
            $response = $app->handle($request);

            $duration = microtime(true) - $start;

            $this->assertContains($response->getStatusCode(), [200, 302],
                "Route {$route} should respond with 200 or redirect");

            $this->assertLessThan(2.0, $duration,
                "Route {$route} should respond in less than 2 seconds (actual: "
                . round($duration, 3) . "s)");
        }
    }
}
```

### Unit Testing: Domain Services

Test business logic in isolation:

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Domain\User\Service;

use App\Domain\User\Entity\User;
use App\Domain\User\Repository\UserRepository;
use App\Domain\User\Service\UserCreator;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class UserCreatorTest extends TestCase
{
    /**
     * Test user creation with valid data
     */
    #[Test]
    public function testCreateUserWithValidData(): void
    {
        $repository = $this->createMock(UserRepository::class);
        $repository->expects($this->once())
            ->method('save')
            ->willReturn(1);

        $service = new UserCreator($repository);
        $userId = $service->create('john@example.com', 'secret123');

        $this->assertEquals(1, $userId);
    }

    /**
     * Test user creation with duplicate email throws exception
     */
    #[Test]
    public function testCreateUserWithDuplicateEmailThrowsException(): void
    {
        $repository = $this->createMock(UserRepository::class);
        $repository->expects($this->once())
            ->method('findByEmail')
            ->willReturn(new User(1, 'john@example.com'));

        $service = new UserCreator($repository);

        $this->expectException(\DomainException::class);
        $service->create('john@example.com', 'secret123');
    }
}
```

### Data Providers for Multiple Scenarios

Use PHPUnit data providers to test multiple scenarios without duplication:

```php
<?php

declare(strict_types=1);

namespace Tests\Functional;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ValidationTest extends TestCase
{
    /**
     * Test email validation rejects invalid emails
     *
     * @param string $email Invalid email to test
     *
     * @dataProvider invalidEmailProvider
     */
    #[Test]
    #[DataProvider('invalidEmailProvider')]
    public function testInvalidEmailRejected(string $email): void
    {
        $app = $this->getAppInstance();
        $data = ['email' => $email, 'password' => 'secret123'];

        $request = $this->createRequest('POST', '/api/users')
            ->withParsedBody($data);

        $response = $app->handle($request);

        $this->assertEquals(422, $response->getStatusCode(),
            "Email '{$email}' should be rejected as invalid");
    }

    /**
     * Provide invalid email examples
     */
    public static function invalidEmailProvider(): array
    {
        return [
            'missing @' => ['invalid'],
            'missing domain' => ['@example.com'],
            'missing user' => ['user@'],
            'empty string' => [''],
            'spaces' => ['user @example.com'],
        ];
    }
}
```

### Best Practices for Testing Slim Applications

1. **Isolate Tests**: Clear `$_SESSION` in `tearDown()` to prevent test interference
2. **Mock Middleware**: Mock authentication/CSRF middleware in `bootstrap.php` for faster tests
3. **Use Data Providers**: Test multiple scenarios with PHPUnit `#[DataProvider]` attribute
4. **Test Business Logic**: Unit test domain services separately from HTTP layer
5. **Smoke Tests**: Create simple tests that verify all routes return successful responses
6. **Group Tests**: Use `@group` annotations to run specific test suites (e.g., `@group critical`)
7. **Document Tests**: Add PHPDoc comments explaining what business functionality is being tested
8. **Performance Tests**: Assert critical routes respond within acceptable time limits
9. **Session Isolation**: Always clean session state between tests for predictable results
10. **Real Data**: Use realistic test data that matches production data structures

### Running Tests

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit tests/Functional

# Run tests with specific group
./vendor/bin/phpunit --group critical

# Run tests with coverage (requires Xdebug)
./vendor/bin/phpunit --coverage-html coverage/
```

## Performance

### Use Caching (PSR-6 / PSR-16)

Cache expensive operations using Symfony Cache Components which support PSR-6 and PSR-16:

```bash
composer require symfony/cache
```

#### Development: FilesystemAdapter

Use file-based caching for development:

```php
<?php
// config/dependencies.php

use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Psr\Container\ContainerInterface;
use Psr\SimpleCache\CacheInterface;

return [
    CacheInterface::class => function (ContainerInterface $c) {
        return new FilesystemAdapter(
            namespace: 'app',
            defaultLifetime: 3600,
            directory: __DIR__ . '/../var/cache'
        );
    },
];
```

#### Production: Redis Adapter

Use Redis for production to leverage in-memory caching:

```bash
composer require symfony/cache
composer require predis/predis
```

```php
<?php
// config/dependencies.php

use Symfony\Component\Cache\Adapter\RedisAdapter;
use Symfony\Component\Cache\Marshaller\DeflateMarshaller;
use Symfony\Component\Cache\Marshaller\DefaultMarshaller;
use Psr\Container\ContainerInterface;
use Psr\SimpleCache\CacheInterface;

return [
    CacheInterface::class => function (ContainerInterface $c) {
        $settings = $c->get('settings');

        // Connect to Redis
        $redis = RedisAdapter::createConnection(
            $settings['redis']['dsn'] // redis://localhost:6379
        );

        // Use DeflateMarshaller for compression (better performance)
        $marshaller = new DeflateMarshaller(new DefaultMarshaller());

        return new RedisAdapter(
            redis: $redis,
            namespace: 'app',
            defaultLifetime: 3600,
            marshaller: $marshaller
        );
    },
];
```

#### Using Cache in Your Application

```php
<?php

use Psr\SimpleCache\CacheInterface;

class PostService
{
    private CacheInterface $cache;
    private PostRepository $repository;

    public function __construct(
        CacheInterface $cache,
        PostRepository $repository
    ) {
        $this->cache = $cache;
        $this->repository = $repository;
    }

    public function getAllPosts(): array
    {
        // Try to get from cache
        $cacheKey = 'posts.all';
        $posts = $this->cache->get($cacheKey);

        if ($posts === null) {
            // Cache miss - fetch from database
            $posts = $this->repository->findAll();

            // Store in cache for 1 hour
            $this->cache->set($cacheKey, $posts, 3600);
        }

        return $posts;
    }

    public function getPost(int $id): ?Post
    {
        $cacheKey = "post.{$id}";

        return $this->cache->get($cacheKey, function () use ($id) {
            // This callback is only executed on cache miss
            return $this->repository->find($id);
        });
    }

    public function updatePost(int $id, array $data): Post
    {
        $post = $this->repository->update($id, $data);

        // Invalidate cache
        $this->cache->delete("post.{$id}");
        $this->cache->delete('posts.all');

        return $post;
    }
}
```

### Enable OPcache in Production

Configure OPcache in your production `php.ini` for significant performance gains:

```ini
; Enable OPcache
opcache.enable=1
opcache.enable_cli=1

; Memory settings
opcache.memory_consumption=256
opcache.interned_strings_buffer=16

; File settings
opcache.max_accelerated_files=20000

; Validation
opcache.validate_timestamps=0  ; Disable in production for best performance
opcache.revalidate_freq=0      ; Only relevant if validate_timestamps=1

; Optimization
opcache.save_comments=1        ; Required for Doctrine annotations
opcache.fast_shutdown=1
```

**Important:** Set `opcache.validate_timestamps=0` in production to prevent checking file modifications on every request. You'll need to clear OPcache when deploying new code:

```bash
# Clear OPcache after deployment
php -r "opcache_reset();"
# Or restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

### Use HTTP Response Caching

Implement HTTP caching headers for routes that serve static or rarely-changing content:

```php
<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class HttpCacheMiddleware implements MiddlewareInterface
{
    private int $maxAge;
    private bool $public;

    public function __construct(int $maxAge = 3600, bool $public = true)
    {
        $this->maxAge = $maxAge;
        $this->public = $public;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $response = $handler->handle($request);

        $cacheControl = $this->public ? 'public' : 'private';
        $cacheControl .= ", max-age={$this->maxAge}";

        return $response
            ->withHeader('Cache-Control', $cacheControl)
            ->withHeader('Expires', gmdate('D, d M Y H:i:s', time() + $this->maxAge) . ' GMT');
    }
}
```

Use it on specific routes:

```php
<?php
// config/routes.php

use App\Middleware\HttpCacheMiddleware;

return function (App $app) {
    // Cache for 1 hour
    $app->get('/api/public-data', GetPublicDataAction::class)
        ->add(new HttpCacheMiddleware(3600));

    // Cache for 1 day
    $app->get('/api/static-content', GetStaticContentAction::class)
        ->add(new HttpCacheMiddleware(86400));

    // Private cache (user-specific)
    $app->get('/api/user/profile', GetUserProfileAction::class)
        ->add(new HttpCacheMiddleware(300, false));
};
```

### Implement ETag for Conditional Requests

```php
<?php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ETagMiddleware implements MiddlewareInterface
{
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $response = $handler->handle($request);

        // Generate ETag from response body
        $etag = md5((string) $response->getBody());
        $response = $response->withHeader('ETag', $etag);

        // Check If-None-Match header
        $ifNoneMatch = $request->getHeaderLine('If-None-Match');

        if ($ifNoneMatch === $etag) {
            // Content hasn't changed, return 304 Not Modified
            return $response
                ->withStatus(304)
                ->withBody(
                    $response->getBody()->rewind()
                );
        }

        return $response;
    }
}
```

## CORS (Cross-Origin Resource Sharing)

### Understand CORS Security

CORS is a security feature implemented in web browsers that allows or restricts web pages from making requests to a domain different from the one that served the web page. It's essential for enabling secure communication between different web applications.

### Implement CORS Middleware

Create a CORS middleware following the proper flow (check preflight requests, add headers):

```php
<?php
// src/Middleware/CorsMiddleware.php

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;

class CorsMiddleware implements MiddlewareInterface
{
    private ResponseFactoryInterface $responseFactory;
    private array $allowedOrigins;
    private array $allowedMethods;
    private array $allowedHeaders;
    private bool $allowCredentials;
    private int $maxAge;

    public function __construct(
        ResponseFactoryInterface $responseFactory,
        array $allowedOrigins = ['*'],
        array $allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        array $allowedHeaders = ['X-Requested-With', 'Content-Type', 'Accept', 'Origin', 'Authorization'],
        bool $allowCredentials = false,
        int $maxAge = 86400
    ) {
        $this->responseFactory = $responseFactory;
        $this->allowedOrigins = $allowedOrigins;
        $this->allowedMethods = $allowedMethods;
        $this->allowedHeaders = $allowedHeaders;
        $this->allowCredentials = $allowCredentials;
        $this->maxAge = $maxAge;
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'OPTIONS') {
            $response = $this->responseFactory->createResponse();
        } else {
            $response = $handler->handle($request);
        }

        // Add CORS headers
        $origin = $request->getHeaderLine('Origin');

        if ($this->isOriginAllowed($origin)) {
            $response = $response
                ->withHeader('Access-Control-Allow-Origin', $origin)
                ->withHeader('Access-Control-Allow-Methods', implode(', ', $this->allowedMethods))
                ->withHeader('Access-Control-Allow-Headers', implode(', ', $this->allowedHeaders))
                ->withHeader('Access-Control-Max-Age', (string) $this->maxAge);

            if ($this->allowCredentials) {
                $response = $response->withHeader('Access-Control-Allow-Credentials', 'true');
            }
        }

        return $response;
    }

    private function isOriginAllowed(string $origin): bool
    {
        if (in_array('*', $this->allowedOrigins, true)) {
            return true;
        }

        return in_array($origin, $this->allowedOrigins, true);
    }
}
```

### Configure CORS in Your Application

```php
<?php
// config/middleware.php

use App\Middleware\CorsMiddleware;
use Slim\App;

return function (App $app) {
    // Add CORS middleware before routing
    $app->add(new CorsMiddleware(
        $app->getResponseFactory(),
        allowedOrigins: [
            'https://example.com',
            'https://app.example.com'
        ],
        allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        allowCredentials: true,  // Only if you need cookies/auth
        maxAge: 86400
    ));

    $app->addRoutingMiddleware();
    $app->addErrorMiddleware(true, true, true);
};
```

### Important CORS Considerations

**Security:**
- **Never** use `'*'` for `Access-Control-Allow-Origin` when `allowCredentials` is `true`
- Be specific about allowed origins in production
- Validate origins against a whitelist

**Headers:**
- You must explicitly list allowed headers; `'*'` may not work in all scenarios
- Include `Authorization` if using JWT or bearer tokens
- Include `Content-Type` for POST/PUT requests with JSON

**Preflight:**
- OPTIONS requests must return 200 status
- Cache preflight responses with `Access-Control-Max-Age` to reduce requests

### Using Third-Party CORS Middleware

Alternatively, use the battle-tested `tuupola/cors-middleware`:

```bash
composer require tuupola/cors-middleware
```

```php
<?php

use Tuupola\Middleware\CorsMiddleware;

$app->add(new CorsMiddleware([
    "origin" => ["https://example.com"],
    "methods" => ["GET", "POST", "PUT", "PATCH", "DELETE"],
    "headers.allow" => ["Authorization", "Content-Type", "Accept"],
    "headers.expose" => ["X-Total-Count"],
    "credentials" => true,
    "cache" => 86400
]));
```

## Deployment

### Set Up Proper Directory Structure and Permissions

Ensure your `var/` directory structure is correct with proper permissions:

```bash
your_project/
├─ var/
│  ├─ cache/      # Application cache files
│  ├─ log/        # Log files
│  └─ tmp/        # Temporary files
```

### Configure Directory Permissions

Set permissions to `0775` for the web server and CLI user to both have write access:

```bash
# Create directories
mkdir -p var/cache var/log var/tmp

# Set permissions using umask
umask 0002
chmod -R 0775 var/

# Set ownership (adjust user/group to match your setup)
chown -R www-data:www-data var/
```

### Use ACL for Better Permission Management

**Recommended approach:** Use Access Control Lists (ACL) to avoid permission conflicts:

```bash
# Install ACL (if not already installed)
sudo apt-get install acl  # Debian/Ubuntu
sudo yum install acl      # CentOS/RHEL

# Set ACL permissions
# Replace 'www-data' with your web server user
# Replace 'youruser' with your CLI user

HTTPDUSER=$(ps axo user,comm | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1)

# Set ACL for web server user
sudo setfacl -R -m u:"$HTTPDUSER":rwX -m u:$(whoami):rwX var/
sudo setfacl -dR -m u:"$HTTPDUSER":rwX -m u:$(whoami):rwX var/
```

This ensures both the web server and your user can write to cache/log directories.

### Use Environment-Specific Configuration

Maintain separate configurations for different environments:

```text
.env.development
.env.testing
.env.production
```

Load the appropriate environment file based on your deployment:

```php
<?php
// public/index.php

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');

// Load environment-specific file if it exists
$env = $_ENV['APP_ENV'] ?? 'production';
if (file_exists(__DIR__ . "/../.env.{$env}")) {
    $dotenv->load(__DIR__ . "/../.env.{$env}");
} else {
    $dotenv->load();
}
```

### Automate Deployment

Use deployment tools like [Deployer](https://deployer.org/), [Capistrano](https://capistranorb.com/), or CI/CD pipelines (GitHub Actions, GitLab CI, etc.).

Example Deployer script:

```php
<?php
// deploy.php

namespace Deployer;

require 'recipe/common.php';

set('application', 'my-slim-app');
set('repository', 'git@github.com:user/repo.git');
set('keep_releases', 3);

host('production')
    ->set('remote_user', 'deployer')
    ->set('deploy_path', '/var/www/html');

// Tasks
task('deploy:vendors', function () {
    run('cd {{release_path}} && composer install --no-dev --optimize-autoloader');
});

task('deploy:cache_clear', function () {
    run('cd {{release_path}} && php -r "opcache_reset();"');
    run('cd {{release_path}} && rm -rf var/cache/*');
});

task('deploy', [
    'deploy:prepare',
    'deploy:vendors',
    'deploy:cache_clear',
    'deploy:publish'
]);

after('deploy:failed', 'deploy:unlock');
```

### Production Deployment Checklist

Before deploying to production:

- [ ] Set `displayErrorDetails` to `false` in error middleware
- [ ] Set `APP_ENV=production` in environment variables
- [ ] Enable OPcache (`opcache.validate_timestamps=0`)
- [ ] Configure proper error logging (Monolog to `var/log/`)
- [ ] Use HTTPS (enforce with middleware if needed)
- [ ] Set secure session settings (`secure=true`, `httponly=true`, `samesite=strict`)
- [ ] Enable CSRF protection for web forms
- [ ] Set up database backups (automated)
- [ ] Configure rate limiting for API endpoints
- [ ] Set up monitoring and alerts (application and server)
- [ ] Clear application cache after deployment
- [ ] Set proper directory permissions (`var/` with ACL)
- [ ] Verify `.env` file is **NOT** in version control
- [ ] Configure log rotation (logrotate)
- [ ] Test on staging environment first
- [ ] Set up health check endpoint (`/health`)
- [ ] Configure Redis for cache (if using cache)
- [ ] Review and optimize database indexes
- [ ] Enable CORS only for trusted origins

## Summary

These best practices are designed to help you build maintainable, secure, and performant Slim 4 applications.

### Key Takeaways

**Configuration:**
- Use environment variables for infrastructure (database, Redis, etc.)
- Use settings files for application configuration
- Never commit `.env` files to version control

**Architecture:**
- Organize code by domain, not by technical layers
- Use single-action controllers (invokable classes)
- Apply dependency injection consistently
- Enable autowiring for cleaner code

**Middleware:**
- Understand LIFO execution order
- Use PSR-15 standard for portability
- Apply middleware at the appropriate level (app, group, route)
- Order matters: BodyParsing → Routing → Custom → Error

**Security:**
- Hash passwords with `password_hash()` / `password_verify()`
- Use JWT for API authentication
- Implement proper CORS configuration
- Validate and sanitize all user input
- Use HTTPS in production
- Never expose sensitive details in error responses

**Error Handling & Logging:**
- Use HTTP exceptions (`HttpNotFoundException`, etc.)
- Log everything with Monolog (PSR-3)
- Use appropriate log levels (DEBUG → EMERGENCY)
- Rotate logs automatically with `RotatingFileHandler`
- Hide error details in production

**Performance:**
- Cache with Symfony Cache Components (PSR-6/PSR-16)
- Use Redis in production, FilesystemAdapter in development
- Enable OPcache with `opcache.validate_timestamps=0` in production
- Implement HTTP caching headers for static content
- Use ETag for conditional requests

**Database:**
- Use ORM (Doctrine/Eloquent) for complex applications
- Implement Repository pattern
- Never query in controllers/actions

**Testing:**
- Write unit and integration tests
- Smoke test all URLs
- Use data providers for multiple scenarios

**Deployment:**
- Set up proper `var/` directory structure (cache, log, tmp)
- Use ACL for permissions (0775)
- Automate with Deployer or CI/CD
- Follow the deployment checklist
- Test on staging first

### Common Pitfalls to Avoid

**Architecture:**
- Putting templates in `src/` directory
- Putting HTML/Twig in PHP classes
- Mixing business logic with HTTP concerns
- Database queries in Actions (use Repositories)
- Accessing container directly in actions

**Middleware:**
- Forgetting middleware execution order (LIFO)
- Not ordering middleware properly (Error should be last added)

**Security:**
- Using `'*'` for CORS with credentials
- Exposing stack traces to end users
- Not validating/sanitizing user input
- Storing passwords in plain text

**Performance & Logging:**
- Not logging errors in production
- Using wrong log levels
- Not invalidating cache after updates
- Not using OPcache in production

**Configuration:**
- Hardcoding configuration values
- Committing `.env` files to version control
- Not using environment-specific configs

### Recommended Packages

**Core:**
- `slim/slim` - The framework
- `slim/psr7` - PSR-7 implementation
- `php-di/php-di` - Dependency injection container

**Development:**
- `vlucas/phpdotenv` - Environment variable management
- `symfony/cache` - Caching (PSR-6/PSR-16)
- `monolog/monolog` - Logging (PSR-3)

**Security:**
- `firebase/php-jwt` or `lcobucci/jwt` - JWT tokens
- `respect/validation` - Input validation
- `tuupola/cors-middleware` - CORS handling

**Templates:**
- `slim/twig-view` - Twig integration
- `slim/php-view` - Simple PHP templates

**Database:**
- `doctrine/orm` - Object-relational mapping
- `illuminate/database` - Laravel's Eloquent ORM

**Testing:**
- `phpunit/phpunit` - Unit testing
- `fakerphp/faker` - Test data generation

Adapt these practices to your specific needs and project requirements. Slim's flexibility allows you to choose what works best for your use case while maintaining clean, professional code.
