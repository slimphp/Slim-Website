---
title: Coding Standards
---

Slim code contributed by the community should follow consistent coding standards to make every piece of code look and feel familiar. This document defines the coding standards that all Slim 4 contributions should follow.

These coding standards are based on the [PSR-1](https://www.php-fig.org/psr/psr-1/), [PSR-4](https://www.php-fig.org/psr/psr-4/), and [PSR-12](https://www.php-fig.org/psr/psr-12/) standards, so you may already know most of them.

## Making Your Code Follow the Coding Standards

Instead of reviewing your code manually, use automated tools to ensure your code matches the expected syntax. Install [PHP CS Fixer](https://cs.symfony.com/) and run:

```bash
composer require --dev friendsofphp/php-cs-fixer

# Create configuration file
cat > .php-cs-fixer.php << 'EOF'
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/src')
    ->in(__DIR__ . '/tests');

$config = new PhpCsFixer\Config();
return $config
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
        'not_operator_with_successor_space' => false,
        'trailing_comma_in_multiline' => ['elements' => ['arrays', 'parameters']],
        'phpdoc_scalar' => true,
        'unary_operator_spaces' => true,
        'binary_operator_spaces' => true,
        'blank_line_before_statement' => [
            'statements' => ['break', 'continue', 'declare', 'return', 'throw', 'try'],
        ],
        'phpdoc_single_line_var_spacing' => true,
        'phpdoc_var_without_name' => true,
        'class_attributes_separation' => [
            'elements' => [
                'method' => 'one',
            ],
        ],
        'method_argument_space' => [
            'on_multiline' => 'ensure_fully_multiline',
            'keep_multiple_spaces_after_comma' => true,
        ],
        'single_trait_insert_per_statement' => true,
    ])
    ->setFinder($finder);
EOF

# Run PHP CS Fixer
vendor/bin/php-cs-fixer fix --verbose
```

## Slim Coding Standards in Detail

Here's an example demonstrating most features described in this document:

```php
<?php

declare(strict_types=1);

namespace App\Action\User;

use App\Domain\User\Repository\UserRepository;
use App\Domain\User\Service\UserCreator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Log\LoggerInterface;

/**
 * Creates a new user in the system.
 */
final readonly class CreateUserAction
{
    /**
     * @param UserRepository $repository User repository for database operations
     * @param UserCreator    $creator    Service for creating users
     * @param LoggerInterface $logger    Logger instance
     */
    public function __construct(
        private UserRepository $repository,
        private UserCreator $creator,
        private LoggerInterface $logger,
    ) {}

    /**
     * Handles the user creation request.
     *
     * @throws \InvalidArgumentException when validation fails
     * @throws \RuntimeException         when user already exists
     */
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $data = (array) $request->getParsedBody();

        if (!$this->validateInput($data)) {
            return $this->jsonResponse($response, [
                'error' => 'Invalid input data',
            ], 422);
        }

        if ($this->repository->findByEmail($data['email'])) {
            $this->logger->warning('Attempt to create duplicate user', [
                'email' => $data['email'],
            ]);

            return $this->jsonResponse($response, [
                'error' => 'User already exists',
            ], 409);
        }

        $user = $this->creator->create(
            $data['email'],
            $data['password'],
            $data['name'] ?? ''
        );

        $this->logger->info('User created successfully', [
            'userId' => $user->getId(),
            'email' => $user->getEmail(),
        ]);

        return $this->jsonResponse($response, [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
        ], 201);
    }

    /**
     * Validates input data for user creation.
     */
    private function validateInput(array $data): bool
    {
        $requiredFields = ['email', 'password'];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                return false;
            }
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        return true;
    }

    /**
     * Creates a JSON response.
     */
    private function jsonResponse(
        ResponseInterface $response,
        array $data,
        int $status = 200
    ): ResponseInterface {
        $response->getBody()->write(
            json_encode($data, JSON_THROW_ON_ERROR)
        );

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
```

## PHP 8.4 Specific Features

### Use Modern PHP Features

Since Slim 4 supports PHP 8.4, use modern language features:

**Constructor Property Promotion:**
```php
<?php

// Good: PHP 8+ constructor property promotion
final readonly class UserService
{
    public function __construct(
        private UserRepository $repository,
        private LoggerInterface $logger,
    ) {}
}

// Avoid: Old-style constructor
class UserService
{
    private UserRepository $repository;
    private LoggerInterface $logger;

    public function __construct(
        UserRepository $repository,
        LoggerInterface $logger
    ) {
        $this->repository = $repository;
        $this->logger = $logger;
    }
}
```

**Readonly Properties:**
```php
<?php

// Good: Use readonly for immutable data
final readonly class User
{
    public function __construct(
        public int $id,
        public string $email,
        public string $name,
    ) {}
}

// For mutable classes, use readonly selectively
final class Session
{
    public function __construct(
        public readonly string $id,
        public readonly int $userId,
        private \DateTimeInterface $expiresAt,
    ) {}

    public function extend(int $seconds): void
    {
        $this->expiresAt = $this->expiresAt->modify("+{$seconds} seconds");
    }
}
```

**Typed Properties:**
```php
<?php

// Always use type declarations
final class UserPreferences
{
    private string $theme = 'light';
    private bool $emailNotifications = true;
    private ?int $itemsPerPage = null;
    private array $preferences = [];
}
```

**Union Types:**
```php
<?php

function processId(int|string $id): User
{
    if (is_int($id)) {
        return $this->repository->find($id);
    }

    return $this->repository->findByUuid($id);
}
```

**Named Arguments:**
```php
<?php

// Good: Use named arguments for clarity
$user = new User(
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    role: 'admin',
);

// Good: Especially useful with many optional parameters
$response = $this->createResponse(
    data: $data,
    status: 201,
    headers: ['X-Custom-Header' => 'value'],
);
```

**Match Expression:**
```php
<?php

// Good: Use match instead of switch
$status = match ($httpCode) {
    200, 201 => 'success',
    400, 422 => 'client_error',
    500, 503 => 'server_error',
    default => 'unknown',
};

// Avoid: switch statement for simple value mapping
switch ($httpCode) {
    case 200:
    case 201:
        $status = 'success';
        break;
    // ...
}
```

**Nullsafe Operator:**
```php
<?php

// Good: Use nullsafe operator
$country = $user?->getAddress()?->getCountry();

// Avoid: Multiple null checks
$country = null;
if ($user !== null) {
    $address = $user->getAddress();
    if ($address !== null) {
        $country = $address->getCountry();
    }
}
```

## Structure

* **Add a single space after each comma delimiter**
  ```php
  $values = [1, 2, 3];
  function example($arg1, $arg2, $arg3) {}
  ```

* **Add a single space around binary operators** (`==`, `&&`, etc.), except concatenation (`.`)
  ```php
  $result = $a + $b;
  $combined = $first . $second;  // No space around .
  ```

* **Place unary operators adjacent to the affected variable**
  ```php
  !$value
  ++$counter
  ```

* **Always use identical comparison** (`===`, `!==`) unless you need type juggling
  ```php
  if ($value === null) {}
  if ($count !== 0) {}
  ```

* **Use Yoda conditions** when checking a variable against an expression
  ```php
  if (null === $value) {}
  if (200 === $response->getStatusCode()) {}
  ```

* **Add a comma after each array item** in multi-line arrays, including the last one
  ```php
  $config = [
      'key1' => 'value1',
      'key2' => 'value2',
      'key3' => 'value3',  // Trailing comma
  ];
  ```

* **Add a blank line before `return` statements**, unless alone in a block
  ```php
  public function example(): string
  {
      $value = $this->process();

      return $value;  // Blank line before
  }

  public function simple(): string
  {
      return 'value';  // No blank line needed
  }
  ```

* **Use `return null;`** for explicit null returns, `return;` for void
  ```php
  public function find(int $id): ?User
  {
      // ...
      return null;  // Explicit null
  }

  public function process(): void
  {
      // ...
      return;  // Void return
  }
  ```

* **Always use braces** for control structures, even single statements
  ```php
  // Good
  if ($condition) {
      doSomething();
  }

  // Bad
  if ($condition) doSomething();
  ```

* **Define one class per file**

* **Declare class inheritance and interfaces on the same line**
  ```php
  final class UserService implements ServiceInterface
  {
  }
  ```

* **Declare properties before methods**, public before protected before private
  ```php
  final class Example
  {
      public const STATUS_ACTIVE = 'active';

      public string $publicProperty;
      protected string $protectedProperty;
      private string $privateProperty;

      public function __construct() {}
      public function publicMethod() {}
      protected function protectedMethod() {}
      private function privateMethod() {}
  }
  ```

* **Use parentheses when instantiating classes**
  ```php
  $object = new ClassName();  // Not new ClassName;
  ```

* **Use `sprintf()` for exception messages**
  ```php
  throw new \RuntimeException(
      sprintf('User with ID "%d" not found', $userId)
  );
  ```

* **Exception messages: start with capital, end with period, use double quotes**
  ```php
  throw new \InvalidArgumentException('The "email" field is required.');
  ```

* **Do not use `else`/`elseif` after `return` or `throw`**
  ```php
  // Good
  public function example(?string $value): string
  {
      if ($value === null) {
          return 'default';
      }

      return strtoupper($value);
  }

  // Bad
  public function example(?string $value): string
  {
      if ($value === null) {
          return 'default';
      } else {
          return strtoupper($value);
      }
  }
  ```

* **Use strict types declaration**
  ```php
  <?php

  declare(strict_types=1);

  namespace App\Action;
  ```

## Naming Conventions

* **Variables, methods, functions**: `camelCase`
  ```php
  $userRepository
  $isActive
  public function getUserById() {}
  ```

* **Configuration parameters, routes**: `snake_case`
  ```php
  'database_host'
  'items_per_page'
  'api.user.create'
  ```

* **Constants**: `SCREAMING_SNAKE_CASE`
  ```php
  public const MAX_RETRY_ATTEMPTS = 3;
  public const DEFAULT_TIMEOUT = 30;
  ```

* **Classes, interfaces, traits**: `UpperCamelCase`
  ```php
  UserService
  UserRepositoryInterface
  TimestampableTrait
  ```

* **Prefix abstract classes** with `Abstract`
  ```php
  abstract class AbstractRepository {}
  ```

* **Suffix interfaces** with `Interface`
  ```php
  interface UserRepositoryInterface {}
  ```

* **Suffix traits** with `Trait`
  ```php
  trait TimestampableTrait {}
  ```

* **Suffix exceptions** with `Exception`
  ```php
  class UserNotFoundException extends \Exception {}
  ```

* **PHP files**: `UpperCamelCase.php`
  ```
  UserService.php
  CreateUserAction.php
  ```

* **Templates and assets**: `snake_case`
  ```
  user_profile.html.twig
  main_layout.html.twig
  app.css
  ```

## Service Naming Conventions

* **Service name = Fully Qualified Class Name (FQCN)**
  ```php
  App\Action\User\CreateUserAction::class
  App\Domain\User\Service\UserCreator::class
  ```

* **Multiple services for same class**: Use FQCN for main service, lowercase + underscores for others
  ```php
  'App\Service\Mailer'              // Main service
  'mailer.transactional'            // Alternative
  'mailer.marketing'                // Alternative
  ```

* **Parameters**: lowercase
  ```php
  'app.admin_email'
  'app.items_per_page'
  ```

## Documentation

* **Add PHPDoc only when it adds value** beyond the method signature
  ```php
  // Good: Adds useful information
  /**
   * Finds users by their email domain.
   *
   * @param string $domain The email domain to search for (e.g., "example.com")
   *
   * @return User[] Array of users matching the domain
   *
   * @throws \InvalidArgumentException when domain format is invalid
   */
  public function findByEmailDomain(string $domain): array

  // Bad: Duplicates type information
  /**
   * Get user by ID.
   *
   * @param int $id
   * @return User|null
   */
  public function getUserById(int $id): ?User
  ```

* **Omit `@return` for void methods**
  ```php
  /**
   * Processes the user registration.
   */
  public function process(): void
  {
  }
  ```

* **Group annotations together**
  ```php
  /**
   * Creates a new user.
   *
   * @param string $email User email address
   * @param string $name  User full name
   *
   * @throws \InvalidArgumentException when email is invalid
   * @throws \RuntimeException         when user creation fails
   *
   * @return User The created user instance
   */
  ```

* **Never use one-line PHPDoc**
  ```php
  // Bad
  /** @var UserRepository */
  private $repository;

  // Good
  /**
   * @var UserRepository
   */
  private $repository;

  // Better: Use native types instead
  private UserRepository $repository;
  ```

## Type Hints

* **Always use native type hints** when possible
  ```php
  // Good
  public function process(string $value): int

  // Bad: Using PHPDoc instead of native types
  /**
   * @param string $value
   * @return int
   */
  public function process($value)
  ```

* **Use PHPDoc for array types**
  ```php
  /**
   * @param User[] $users
   * @return string[]
   */
  public function processUsers(array $users): array
  ```

* **Use `bool`, `int`, `float` in PHPDoc** (not `boolean`, `integer`, `double`)
  ```php
  /**
   * @param bool $active
   * @param int  $count
   * @param float $amount
   */
  ```

## Slim-Specific Conventions

### Action Classes

* **Use `final readonly` for stateless actions**
  ```php
  final readonly class CreateUserAction
  {
      public function __construct(
          private UserCreator $creator,
      ) {}

      public function __invoke(
          ServerRequestInterface $request,
          ResponseInterface $response
      ): ResponseInterface {
          // ...
      }
  }
  ```

* **Suffix action classes with `Action`**
  ```php
  CreateUserAction
  ListUsersAction
  UpdateUserAction
  ```

### Middleware

* **Implement `MiddlewareInterface`**
  ```php
  final readonly class AuthenticationMiddleware implements MiddlewareInterface
  {
      public function process(
          ServerRequestInterface $request,
          RequestHandlerInterface $handler
      ): ResponseInterface {
          // ...
      }
  }
  ```

* **Suffix middleware with `Middleware`**
  ```php
  AuthenticationMiddleware
  CorsMiddleware
  RateLimitMiddleware
  ```

### Repository Pattern

* **Suffix repositories with `Repository`**
  ```php
  UserRepository
  PostRepository
  OrderRepository
  ```

For complete repository implementation examples and patterns, see the [Repository Pattern section in Best Practices](/docs/v4/cookbook/best-practices.html#use-the-repository-pattern).

### Domain Services

* **Use descriptive service names**
  ```php
  UserCreator       // Creates users
  UserAuthenticator // Authenticates users
  PasswordHasher    // Hashes passwords
  ```

## File Structure

For comprehensive project structure and directory organization, see the [Project Structure section in Best Practices](/docs/v4/cookbook/best-practices.html#use-a-professional-directory-structure).

This document focuses on coding style, naming conventions, and formatting standards.

## Summary

Following these coding standards ensures:

* **Consistency**: Code looks familiar across the project
* **Readability**: Easy to understand and maintain
* **Quality**: Fewer bugs and better performance
* **Collaboration**: Easier for team members to contribute
* **Modern PHP**: Leverages PHP 8.4 features

Use PHP CS Fixer to automate compliance with these standards, and your code review process will focus on logic rather than formatting.
