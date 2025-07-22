export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  tags: string[];
  keywords: string[];
  summary: string;
  content?: string;
  readTime: number;
  likes: number;
  dislikes: number;
  comments: Comment[];
  featured: boolean;
  status: 'draft' | 'published';
}

export interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  date: string;
  replies?: Comment[];
}

// Blog post metadata without content for static generation
export const blogPostsMetadata: BlogPost[] = [
  {
    id: "scalable-architecture-patterns",
    title: "Building Scalable Architecture: Lessons from 7+ Years in Production",
    author: "Senior Developer",
    date: "2025-01-12",
    tags: ["Architecture", "Scalability", "Microservices", "DevOps", "Performance"],
    keywords: ["scalable architecture", "microservices", "system design", "performance optimization", "production"],
    summary: "Deep dive into architectural patterns that have proven successful in high-traffic production environments. From monoliths to microservices, event-driven architectures, and the hard lessons learned scaling systems to millions of users.",
    readTime: 12,
    likes: 47,
    dislikes: 2,
    featured: true,
    status: 'published',
    comments: [
      {
        id: "1",
        author: "Alex Chen",
        email: "alex@example.com",
        content: "Excellent breakdown of the evolution from monolith to microservices. The section on event sourcing particularly resonated with challenges we're facing.",
        date: "2025-01-13"
      },
      {
        id: "2",
        author: "Sarah Johnson",
        email: "sarah@example.com",
        content: "The performance metrics you shared are impressive. Would love to see more details on your monitoring setup.",
        date: "2025-01-13"
      }
    ]
  },
  {
    id: "advanced-typescript-patterns",
    title: "Advanced TypeScript Patterns for Enterprise Applications",
    author: "Senior Developer",
    date: "2025-01-10",
    tags: ["TypeScript", "Design Patterns", "Enterprise", "Type Safety", "Architecture"],
    keywords: ["typescript", "advanced patterns", "enterprise", "type safety", "generics", "conditional types"],
    summary: "Exploring sophisticated TypeScript patterns used in large-scale enterprise applications. From advanced generics to conditional types, branded types, and type-level programming that ensures runtime safety.",
    readTime: 15,
    likes: 63,
    dislikes: 1,
    featured: true,
    status: 'published',
    comments: [
      {
        id: "3",
        author: "Mike Rodriguez",
        email: "mike@example.com",
        content: "The branded types section is gold! We've been struggling with primitive obsession in our codebase.",
        date: "2025-01-11"
      }
    ]
  },
  {
    id: "production-debugging-techniques",
    title: "Production Debugging: Tools and Techniques That Actually Work",
    author: "Senior Developer",
    date: "2025-01-08",
    tags: ["Debugging", "Production", "Monitoring", "DevOps", "Performance"],
    keywords: ["production debugging", "monitoring", "observability", "performance", "troubleshooting"],
    summary: "Real-world debugging techniques for production systems. From distributed tracing to performance profiling, log analysis, and the tools that have saved me countless hours during critical incidents.",
    readTime: 18,
    likes: 89,
    dislikes: 3,
    featured: false,
    status: 'published',
    comments: [
      {
        id: "4",
        author: "David Kim",
        email: "david@example.com",
        content: "The distributed tracing section is incredibly detailed. We're implementing OpenTelemetry based on your recommendations.",
        date: "2025-01-09"
      },
      {
        id: "5",
        author: "Lisa Wang",
        email: "lisa@example.com",
        content: "Your approach to correlation IDs has solved a major pain point for our team. Thank you!",
        date: "2025-01-09"
      }
    ]
  }
];

// Full blog posts with content
const blogPostsContent: Record<string, string> = {
  "scalable-architecture-patterns": `# Building Scalable Architecture: Lessons from 7+ Years in Production

After architecting and scaling systems that serve millions of users daily, I've learned that scalability isn't just about handling more traffic—it's about building systems that can evolve, maintain, and debug efficiently under pressure.

## The Evolution: From Monolith to Distributed Systems

### Phase 1: The Monolithic Foundation (Years 1-2)
Starting with a well-structured monolith isn't a mistake—it's often the right choice. Here's the Ruby on Rails architecture that served us well initially:

\`\`\`ruby
# app/models/user.rb
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  
  validates :email, presence: true, uniqueness: true
  
  def full_name
    "#{first_name} #{last_name}"
  end
  
  # This method became a bottleneck at scale
  def activity_feed
    Post.joins(:user)
        .where(user: following)
        .order(created_at: :desc)
        .limit(50)
  end
end
\`\`\`

**Key Lessons:**
- Monoliths are easier to deploy, debug, and reason about initially
- Database transactions work seamlessly across the entire application
- Team velocity is high when everyone understands the codebase

### Phase 2: Identifying Bottlenecks (Years 3-4)
As traffic grew to 100K+ daily active users, certain patterns emerged:

\`\`\`typescript
// Performance monitoring revealed these hot paths
interface PerformanceMetrics {
  endpoint: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
}

const criticalEndpoints: PerformanceMetrics[] = [
  {
    endpoint: '/api/feed',
    avgResponseTime: 2400, // 2.4s - unacceptable
    p95ResponseTime: 8000,
    requestsPerSecond: 450,
    errorRate: 0.02
  },
  {
    endpoint: '/api/search',
    avgResponseTime: 1800,
    p95ResponseTime: 5200,
    requestsPerSecond: 200,
    errorRate: 0.01
  }
];
\`\`\`

## Phase 3: Strategic Decomposition (Years 4-6)

### Microservices Architecture
We didn't go full microservices overnight. Instead, we extracted services strategically:

\`\`\`typescript
// User Service - High read, low write
interface UserService {
  getUser(id: string): Promise<User>;
  updateProfile(id: string, data: Partial<User>): Promise<User>;
  getUsersByIds(ids: string[]): Promise<User[]>;
}

// Content Service - High write, complex queries
interface ContentService {
  createPost(post: CreatePostRequest): Promise<Post>;
  getFeed(userId: string, pagination: Pagination): Promise<Post[]>;
  searchPosts(query: SearchQuery): Promise<SearchResult>;
}

// Notification Service - Event-driven
interface NotificationService {
  sendNotification(event: NotificationEvent): Promise<void>;
  getNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationIds: string[]): Promise<void>;
}
\`\`\`

### Event-Driven Communication
One of the most impactful architectural decisions was implementing event sourcing:

\`\`\`typescript
// Event Store Implementation
interface DomainEvent {
  id: string;
  aggregateId: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  version: number;
}

class EventStore {
  async appendEvents(
    aggregateId: string, 
    events: DomainEvent[], 
    expectedVersion: number
  ): Promise<void> {
    const transaction = await this.db.transaction();
    
    try {
      // Optimistic concurrency control
      const currentVersion = await this.getCurrentVersion(aggregateId);
      if (currentVersion !== expectedVersion) {
        throw new ConcurrencyError('Aggregate version mismatch');
      }
      
      for (const event of events) {
        await transaction.events.create({
          data: {
            ...event,
            version: expectedVersion + 1
          }
        });
        expectedVersion++;
      }
      
      await transaction.commit();
      
      // Publish events asynchronously
      this.eventBus.publishBatch(events);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
\`\`\`

## Phase 4: Production-Grade Patterns (Years 6-7+)

### Circuit Breaker Pattern
Preventing cascade failures became critical:

\`\`\`typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime?: Date;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeout: number = 60000,
    private monitoringWindow: number = 120000
  ) {}
  
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
\`\`\`

### Advanced Caching Strategies
Multi-layer caching became essential:

\`\`\`typescript
interface CacheStrategy {
  l1: RedisCache;    // Hot data, 1-5 min TTL
  l2: MemcachedCache; // Warm data, 1-24 hour TTL
  l3: DatabaseCache;  // Cold data, computed views
}

class SmartCache implements CacheStrategy {
  async get<T>(key: string): Promise<T | null> {
    // L1: Redis (sub-millisecond)
    let result = await this.l1.get<T>(key);
    if (result) {
      this.metrics.recordHit('l1', key);
      return result;
    }
    
    // L2: Memcached (1-5ms)
    result = await this.l2.get<T>(key);
    if (result) {
      this.metrics.recordHit('l2', key);
      // Backfill L1 asynchronously
      this.l1.set(key, result, 300).catch(console.error);
      return result;
    }
    
    // L3: Database with computed views
    result = await this.l3.get<T>(key);
    if (result) {
      this.metrics.recordHit('l3', key);
      // Backfill L2 and L1
      Promise.all([
        this.l2.set(key, result, 3600),
        this.l1.set(key, result, 300)
      ]).catch(console.error);
      return result;
    }
    
    this.metrics.recordMiss(key);
    return null;
  }
}
\`\`\`

## Key Metrics That Matter

After years of production experience, these are the metrics I monitor religiously:

\`\`\`typescript
interface ProductionMetrics {
  // Performance
  responseTime: {
    p50: number;
    p95: number;
    p99: number;
  };
  
  // Reliability
  uptime: number;
  errorRate: number;
  
  // Scalability
  throughput: number;
  concurrentUsers: number;
  
  // Business
  conversionRate: number;
  userEngagement: number;
}

const currentMetrics: ProductionMetrics = {
  responseTime: {
    p50: 120,  // 120ms
    p95: 450,  // 450ms
    p99: 1200  // 1.2s
  },
  uptime: 99.97,
  errorRate: 0.001,
  throughput: 15000, // requests/minute
  concurrentUsers: 25000,
  conversionRate: 0.034,
  userEngagement: 0.78
};
\`\`\`

## Lessons Learned

1. **Start Simple, Scale Strategically**: Don't over-engineer early. Build for current needs + 10x growth.

2. **Observability is Non-Negotiable**: You can't optimize what you can't measure. Invest in monitoring early.

3. **Embrace Eventual Consistency**: Perfect consistency is expensive. Design for eventual consistency where possible.

4. **Automate Everything**: Manual processes don't scale. If you do it twice, automate it.

5. **Plan for Failure**: Systems will fail. Design for graceful degradation and quick recovery.

The journey from a simple Rails app to a distributed system serving millions taught me that architecture is about trade-offs, not perfect solutions. Every decision has consequences, and the best architects are those who understand these trade-offs deeply.

*What architectural challenges are you facing? I'd love to discuss specific scenarios in the comments.*`,

  "advanced-typescript-patterns": `# Advanced TypeScript Patterns for Enterprise Applications

After working with TypeScript in large enterprise codebases for several years, I've discovered patterns that go far beyond basic typing. These techniques have saved countless hours of debugging and prevented entire classes of runtime errors.

## Branded Types: Eliminating Primitive Obsession

One of the most powerful patterns I use is branded types to prevent mixing up similar primitive values:

\`\`\`typescript
// The Problem: Primitive Obsession
function transferMoney(fromAccount: string, toAccount: string, amount: number) {
  // Easy to accidentally swap parameters
  // transferMoney(amount, fromAccount, toAccount) // Compiles but wrong!
}

// The Solution: Branded Types
type Brand<T, TBrand> = T & { __brand: TBrand };

type UserId = Brand<string, 'UserId'>;
type AccountId = Brand<string, 'AccountId'>;
type Currency = Brand<number, 'Currency'>;

// Smart constructors ensure type safety
const createUserId = (id: string): UserId => {
  if (!id.match(/^user_[a-zA-Z0-9]+$/)) {
    throw new Error('Invalid user ID format');
  }
  return id as UserId;
};

const createAccountId = (id: string): AccountId => {
  if (!id.match(/^acc_[a-zA-Z0-9]+$/)) {
    throw new Error('Invalid account ID format');
  }
  return id as AccountId;
};

const createCurrency = (amount: number): Currency => {
  if (amount < 0 || !Number.isFinite(amount)) {
    throw new Error('Invalid currency amount');
  }
  return Math.round(amount * 100) as Currency; // Store as cents
};

// Now the function is type-safe
function transferMoney(
  fromAccount: AccountId, 
  toAccount: AccountId, 
  amount: Currency
) {
  // Impossible to mix up parameters!
}
\`\`\`

## Advanced Generic Constraints

Generic constraints become powerful when combined with conditional types:

\`\`\`typescript
// Repository pattern with advanced generics
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends Entity {
  email: string;
  name: string;
}

interface Post extends Entity {
  title: string;
  content: string;
  authorId: string;
}

// Advanced repository with conditional return types
class Repository<T extends Entity> {
  constructor(private entityName: string) {}
  
  // Conditional types for different query scenarios
  async findById<TInclude extends keyof T = never>(
    id: string,
    include?: TInclude[]
  ): Promise<
    TInclude extends never 
      ? T 
      : T & Pick<T, TInclude>
  > {
    // Implementation would handle includes
    const entity = await this.queryDatabase(id, include);
    return entity as any;
  }
  
  // Type-safe bulk operations
  async bulkUpdate<K extends keyof T>(
    ids: string[],
    updates: Partial<Pick<T, K>>
  ): Promise<T[]> {
    // Only allow updating specific fields
    return this.performBulkUpdate(ids, updates);
  }
  
  private async queryDatabase(id: string, include?: any): Promise<T> {
    // Database implementation
    throw new Error('Not implemented');
  }
  
  private async performBulkUpdate(ids: string[], updates: any): Promise<T[]> {
    // Bulk update implementation
    throw new Error('Not implemented');
  }
}

// Usage is completely type-safe
const userRepo = new Repository<User>('users');
const user = await userRepo.findById('123', ['email', 'name']);
// user is typed as User & Pick<User, 'email' | 'name'>
\`\`\`

## State Machine Types

For complex business logic, I use TypeScript to model state machines:

\`\`\`typescript
// Order processing state machine
type OrderState = 
  | 'pending'
  | 'confirmed' 
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

type OrderEvent = 
  | 'confirm'
  | 'process'
  | 'ship'
  | 'deliver'
  | 'cancel';

// Valid transitions mapped at type level
type ValidTransitions = {
  pending: 'confirm' | 'cancel';
  confirmed: 'process' | 'cancel';
  processing: 'ship' | 'cancel';
  shipped: 'deliver';
  delivered: never;
  cancelled: never;
};

// State machine implementation
class OrderStateMachine<TState extends OrderState> {
  constructor(private currentState: TState) {}
  
  // Only allow valid transitions
  transition<TEvent extends ValidTransitions[TState]>(
    event: TEvent
  ): OrderStateMachine<
    TEvent extends 'confirm' ? 'confirmed' :
    TEvent extends 'process' ? 'processing' :
    TEvent extends 'ship' ? 'shipped' :
    TEvent extends 'deliver' ? 'delivered' :
    TEvent extends 'cancel' ? 'cancelled' :
    never
  > {
    const newState = this.calculateNewState(event);
    return new OrderStateMachine(newState as any);
  }
  
  getState(): TState {
    return this.currentState;
  }
  
  private calculateNewState(event: OrderEvent): OrderState {
    // Business logic for state transitions
    switch (this.currentState) {
      case 'pending':
        return event === 'confirm' ? 'confirmed' : 'cancelled';
      case 'confirmed':
        return event === 'process' ? 'processing' : 'cancelled';
      case 'processing':
        return event === 'ship' ? 'shipped' : 'cancelled';
      case 'shipped':
        return 'delivered';
      default:
        throw new Error(\`Invalid transition: \${event} from \${this.currentState}\`);
    }
  }
}

// Usage - completely type-safe state transitions
const order = new OrderStateMachine('pending');
const confirmed = order.transition('confirm'); // ✅ Valid
const processed = confirmed.transition('process'); // ✅ Valid
// const invalid = confirmed.transition('ship'); // ❌ TypeScript error!
\`\`\`

## Advanced Error Handling with Result Types

Instead of throwing exceptions, I use Result types for predictable error handling:

\`\`\`typescript
// Result type implementation
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Helper functions
const Ok = <T>(data: T): Result<T, never> => ({ success: true, data });
const Err = <E>(error: E): Result<never, E> => ({ success: false, error });

// Async operations with Result types
class UserService {
  async createUser(userData: CreateUserRequest): Promise<Result<User, ValidationError | DatabaseError>> {
    // Validate input
    const validationResult = this.validateUserData(userData);
    if (!validationResult.success) {
      return Err(validationResult.error);
    }
    
    try {
      const user = await this.database.users.create(userData);
      return Ok(user);
    } catch (error) {
      if (error.code === 'DUPLICATE_EMAIL') {
        return Err(new ValidationError('Email already exists'));
      }
      return Err(new DatabaseError('Failed to create user'));
    }
  }
  
  private validateUserData(data: CreateUserRequest): Result<CreateUserRequest, ValidationError> {
    if (!data.email?.includes('@')) {
      return Err(new ValidationError('Invalid email format'));
    }
    if (data.password.length < 8) {
      return Err(new ValidationError('Password too short'));
    }
    return Ok(data);
  }
}

// Usage with proper error handling
const userService = new UserService();
const result = await userService.createUser(userData);

if (result.success) {
  console.log('User created:', result.data.id);
} else {
  // TypeScript knows this is an error
  console.error('Failed to create user:', result.error.message);
}
\`\`\`

## Type-Level Validation

For API contracts, I use TypeScript's type system to validate data at compile time:

\`\`\`typescript
// API contract validation
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiEndpoint<TPath extends string, TMethod extends HttpMethod> {
  path: TPath;
  method: TMethod;
}

// Extract path parameters from URL string
type ExtractParams<T extends string> = 
  T extends \`\${infer _Start}/:\${infer Param}/\${infer Rest}\`
    ? { [K in Param]: string } & ExtractParams<\`/\${Rest}\`>
    : T extends \`\${infer _Start}/:\${infer Param}\`
    ? { [K in Param]: string }
    : {};

// API route definitions
const routes = {
  getUser: { path: '/users/:id', method: 'GET' } as const,
  updateUser: { path: '/users/:id', method: 'PUT' } as const,
  getUserPosts: { path: '/users/:userId/posts/:postId', method: 'GET' } as const,
} as const;

// Type-safe API client
class ApiClient {
  async request<T extends keyof typeof routes>(
    route: T,
    params: ExtractParams<typeof routes[T]['path']>,
    body?: any
  ): Promise<any> {
    const { path, method } = routes[route];
    let url = path;
    
    // Replace path parameters
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(\`:\${key}\`, value);
    }
    
    return fetch(url, { method, body: JSON.stringify(body) });
  }
}

// Usage - parameters are type-checked!
const client = new ApiClient();
await client.request('getUser', { id: '123' }); // ✅ Correct
await client.request('getUserPosts', { userId: '123', postId: '456' }); // ✅ Correct
// await client.request('getUser', { userId: '123' }); // ❌ TypeScript error!
\`\`\`

## Performance Considerations

These advanced patterns come with trade-offs:

1. **Compilation Time**: Complex types increase TypeScript compilation time
2. **Bundle Size**: Branded types and Result types add minimal runtime overhead
3. **Developer Experience**: Initial learning curve, but massive productivity gains
4. **Maintainability**: Self-documenting code reduces bugs and onboarding time

## Conclusion

These patterns have transformed how I write TypeScript in enterprise environments. They catch entire classes of bugs at compile time, make refactoring safer, and create self-documenting APIs.

The key is to introduce them gradually. Start with branded types for critical domain objects, then expand to Result types for error handling, and finally explore advanced generic patterns for your most complex business logic.

*Which TypeScript patterns have you found most valuable in your projects?*`,

  "production-debugging-techniques": `# Production Debugging: Tools and Techniques That Actually Work

Production debugging is an art form that separates senior developers from junior ones. After years of being woken up at 3 AM by alerts, I've developed a systematic approach to diagnosing and fixing issues in live systems.

## The Foundation: Observability

Before you can debug effectively, you need comprehensive observability. Here's my standard setup:

\`\`\`typescript
// Structured logging with correlation IDs
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

interface LogContext {
  correlationId: string;
  userId?: string;
  requestId?: string;
  service: string;
  environment: string;
}

class StructuredLogger {
  private logger: Logger;
  
  constructor(private context: LogContext) {
    this.logger = new Logger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            ...this.context,
            ...meta
          });
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' })
      ]
    });
  }
  
  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }
  
  error(message: string, error?: Error, meta?: any) {
    this.logger.error(message, {
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      ...meta
    });
  }
  
  // Create child logger with additional context
  child(additionalContext: Partial<LogContext>): StructuredLogger {
    return new StructuredLogger({
      ...this.context,
      ...additionalContext
    });
  }
}

// Usage in Express middleware
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  const logger = new StructuredLogger({
    correlationId,
    requestId: uuidv4(),
    service: 'api-gateway',
    environment: process.env.NODE_ENV || 'development'
  });
  
  req.logger = logger;
  res.setHeader('x-correlation-id', correlationId);
  
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });
  
  next();
});
\`\`\`

## Distributed Tracing

For microservices, distributed tracing is essential:

\`\`\`typescript
// OpenTelemetry setup
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const jaegerExporter = new JaegerExporter({
  endpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
});

const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Custom spans for business logic
import { trace, SpanStatusCode } from '@opentelemetry/api';

class UserService {
  private tracer = trace.getTracer('user-service');
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    const span = this.tracer.startSpan('user.create');
    
    try {
      span.setAttributes({
        'user.email': userData.email,
        'user.source': userData.source || 'direct'
      });
      
      // Validate user data
      const validationSpan = this.tracer.startSpan('user.validate', { parent: span });
      await this.validateUserData(userData);
      validationSpan.end();
      
      // Create in database
      const dbSpan = this.tracer.startSpan('user.database.create', { parent: span });
      const user = await this.database.users.create(userData);
      dbSpan.setAttributes({
        'db.operation': 'INSERT',
        'db.table': 'users',
        'user.id': user.id
      });
      dbSpan.end();
      
      // Send welcome email
      const emailSpan = this.tracer.startSpan('user.email.welcome', { parent: span });
      await this.emailService.sendWelcomeEmail(user);
      emailSpan.end();
      
      span.setStatus({ code: SpanStatusCode.OK });
      return user;
      
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: (error as Error).message 
      });
      throw error;
    } finally {
      span.end();
    }
  }
}
\`\`\`

## Performance Profiling

When performance issues arise, profiling is crucial:

\`\`\`typescript
// CPU profiling with clinic.js integration
import { performance, PerformanceObserver } from 'perf_hooks';

class PerformanceProfiler {
  private measurements: Map<string, number[]> = new Map();
  
  constructor() {
    // Monitor garbage collection
    const obs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'gc') {
          console.log(\`GC: \${entry.kind} took \${entry.duration}ms\`);
        }
      });
    });
    obs.observe({ entryTypes: ['gc'] });
  }
  
  // Measure function execution time
  async measureAsync<T>(
    name: string, 
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMeasurement(name, duration);
      
      if (duration > 1000) { // Log slow operations
        console.warn(\`Slow operation detected: \${name} took \${duration.toFixed(2)}ms\`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMeasurement(\`\${name}.error\`, duration);
      throw error;
    }
  }
  
  private recordMeasurement(name: string, duration: number) {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);
  }
  
  getStats(name: string) {
    const measurements = this.measurements.get(name) || [];
    if (measurements.length === 0) return null;
    
    const sorted = measurements.sort((a, b) => a - b);
    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }
}

// Usage in service methods
const profiler = new PerformanceProfiler();

class OrderService {
  async processOrder(orderId: string): Promise<Order> {
    return profiler.measureAsync('order.process', async () => {
      const order = await this.getOrder(orderId);
      await this.validateInventory(order);
      await this.processPayment(order);
      await this.updateInventory(order);
      return order;
    });
  }
}
\`\`\`

## Memory Leak Detection

Memory leaks in Node.js can be subtle but devastating:

\`\`\`typescript
// Memory monitoring and leak detection
class MemoryMonitor {
  private snapshots: NodeJS.MemoryUsage[] = [];
  private interval: NodeJS.Timeout;
  
  constructor(private intervalMs: number = 30000) {
    this.interval = setInterval(() => {
      this.takeSnapshot();
    }, intervalMs);
  }
  
  private takeSnapshot() {
    const usage = process.memoryUsage();
    this.snapshots.push(usage);
    
    // Keep only last 100 snapshots
    if (this.snapshots.length > 100) {
      this.snapshots.shift();
    }
    
    // Check for memory leaks
    this.detectLeaks();
    
    // Log current usage
    console.log('Memory Usage:', {
      rss: \`\${Math.round(usage.rss / 1024 / 1024)}MB\`,
      heapUsed: \`\${Math.round(usage.heapUsed / 1024 / 1024)}MB\`,
      heapTotal: \`\${Math.round(usage.heapTotal / 1024 / 1024)}MB\`,
      external: \`\${Math.round(usage.external / 1024 / 1024)}MB\`
    });
  }
  
  private detectLeaks() {
    if (this.snapshots.length < 10) return;
    
    const recent = this.snapshots.slice(-10);
    const heapGrowth = recent[recent.length - 1].heapUsed - recent[0].heapUsed;
    const rssGrowth = recent[recent.length - 1].rss - recent[0].rss;
    
    // Alert if heap grows consistently
    if (heapGrowth > 50 * 1024 * 1024) { // 50MB growth
      console.warn('Potential memory leak detected:', {
        heapGrowth: \`\${Math.round(heapGrowth / 1024 / 1024)}MB\`,
        rssGrowth: \`\${Math.round(rssGrowth / 1024 / 1024)}MB\`
      });
      
      // Take heap snapshot for analysis
      this.takeHeapSnapshot();
    }
  }
  
  private takeHeapSnapshot() {
    const v8 = require('v8');
    const fs = require('fs');
    
    const snapshot = v8.writeHeapSnapshot();
    console.log('Heap snapshot saved:', snapshot);
  }
  
  stop() {
    clearInterval(this.interval);
  }
}

// Start monitoring
const memoryMonitor = new MemoryMonitor();

// Graceful shutdown
process.on('SIGTERM', () => {
  memoryMonitor.stop();
});
\`\`\`

## Database Query Analysis

Slow database queries are often the culprit:

\`\`\`typescript
// Database query monitoring
import { Pool } from 'pg';

class MonitoredDatabase {
  private pool: Pool;
  private slowQueryThreshold = 1000; // 1 second
  
  constructor(config: any) {
    this.pool = new Pool(config);
    this.setupMonitoring();
  }
  
  private setupMonitoring() {
    // Monitor connection pool
    setInterval(() => {
      console.log('DB Pool Stats:', {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount
      });
    }, 30000);
  }
  
  async query(text: string, params?: any[]): Promise<any> {
    const start = performance.now();
    const client = await this.pool.connect();
    
    try {
      const result = await client.query(text, params);
      const duration = performance.now() - start;
      
      // Log slow queries
      if (duration > this.slowQueryThreshold) {
        console.warn('Slow query detected:', {
          query: text,
          params,
          duration: \`\${duration.toFixed(2)}ms\`,
          rowCount: result.rowCount
        });
      }
      
      return result;
    } finally {
      client.release();
    }
  }
  
  // Analyze query execution plans
  async explainQuery(query: string, params?: any[]) {
    const explainQuery = \`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) \${query}\`;
    const result = await this.query(explainQuery, params);
    
    const plan = result.rows[0]['QUERY PLAN'][0];
    console.log('Query Execution Plan:', JSON.stringify(plan, null, 2));
    
    return plan;
  }
}
\`\`\`

## Incident Response Playbook

When things go wrong, having a systematic approach is crucial:

\`\`\`typescript
// Incident response automation
interface IncidentSeverity {
  level: 1 | 2 | 3 | 4 | 5;
  description: string;
  responseTime: number; // minutes
  escalationTime: number; // minutes
}

const severityLevels: Record<number, IncidentSeverity> = {
  1: { level: 1, description: 'Critical - System down', responseTime: 5, escalationTime: 15 },
  2: { level: 2, description: 'High - Major feature broken', responseTime: 15, escalationTime: 30 },
  3: { level: 3, description: 'Medium - Performance degraded', responseTime: 30, escalationTime: 60 },
  4: { level: 4, description: 'Low - Minor issue', responseTime: 60, escalationTime: 120 },
  5: { level: 5, description: 'Info - Monitoring alert', responseTime: 240, escalationTime: 480 }
};

class IncidentManager {
  async handleAlert(alert: AlertData) {
    const severity = this.determineSeverity(alert);
    const incident = await this.createIncident(alert, severity);
    
    // Immediate response actions
    await this.executeRunbook(incident);
    
    // Start escalation timer
    this.scheduleEscalation(incident);
    
    return incident;
  }
  
  private async executeRunbook(incident: Incident) {
    const runbook = this.getRunbook(incident.type);
    
    for (const step of runbook.steps) {
      try {
        console.log(\`Executing: \${step.description}\`);
        await step.action(incident);
        
        incident.timeline.push({
          timestamp: new Date(),
          action: step.description,
          status: 'completed'
        });
      } catch (error) {
        console.error(\`Failed to execute step: \${step.description}\`, error);
        incident.timeline.push({
          timestamp: new Date(),
          action: step.description,
          status: 'failed',
          error: (error as Error).message
        });
      }
    }
  }
  
  private getRunbook(incidentType: string) {
    const runbooks = {
      'high-error-rate': {
        steps: [
          {
            description: 'Check recent deployments',
            action: async (incident: Incident) => {
              const deployments = await this.getRecentDeployments();
              incident.context.recentDeployments = deployments;
            }
          },
          {
            description: 'Analyze error patterns',
            action: async (incident: Incident) => {
              const errors = await this.getRecentErrors();
              incident.context.errorPatterns = this.analyzeErrorPatterns(errors);
            }
          },
          {
            description: 'Check system resources',
            action: async (incident: Incident) => {
              const resources = await this.getSystemResources();
              incident.context.systemResources = resources;
            }
          }
        ]
      }
    };
    
    return runbooks[incidentType] || runbooks['high-error-rate'];
  }
}
\`\`\`

## Key Debugging Tools

My essential toolkit:

1. **Structured Logging**: Winston + ELK Stack
2. **Distributed Tracing**: OpenTelemetry + Jaeger
3. **APM**: New Relic or DataDog
4. **Profiling**: Clinic.js for Node.js
5. **Database**: pgBadger for PostgreSQL analysis
6. **Network**: Wireshark for packet analysis
7. **Load Testing**: Artillery or k6

## Conclusion

Production debugging is about preparation, systematic thinking, and having the right tools. The key is building observability into your systems from day one, not after problems arise.

Remember: the best debugging session is the one you never have to do because your monitoring caught the issue first.

*What debugging techniques have saved you the most time? Share your war stories in the comments!*`
};

// Function to get blog post by ID with full content
export const getBlogPostById = (id: string): BlogPost | undefined => {
  const metadata = blogPostsMetadata.find(post => post.id === id);
  if (!metadata) return undefined;
  
  return {
    ...metadata,
    content: blogPostsContent[id] || ''
  };
};

export const getAllTags = (): string[] => {
  const tagSet = new Set<string>();
  blogPostsMetadata.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

export const getPostsByTag = (tag: string): BlogPost[] => {
  return blogPostsMetadata.filter(post => 
    post.tags.some(postTag => 
      postTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
};

export const searchPosts = (query: string): BlogPost[] => {
  const searchTerm = query.toLowerCase();
  return blogPostsMetadata.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.summary.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
  );
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPostsMetadata.filter(post => post.featured && post.status === 'published');
};

export const getPublishedPosts = (): BlogPost[] => {
  return blogPostsMetadata.filter(post => post.status === 'published');
};

// Mock functions for CRUD operations (in real app, these would connect to a database)
export const createPost = async (post: Omit<BlogPost, 'id' | 'date' | 'likes' | 'dislikes' | 'comments'>): Promise<BlogPost> => {
  const newPost: BlogPost = {
    ...post,
    id: `post-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    likes: 0,
    dislikes: 0,
    comments: []
  };
  blogPostsMetadata.unshift(newPost);
  // In a real app, you'd also store the content separately
  return newPost;
};

export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  const index = blogPostsMetadata.findIndex(post => post.id === id);
  if (index === -1) return null;
  
  blogPostsMetadata[index] = { ...blogPostsMetadata[index], ...updates };
  return blogPostsMetadata[index];
};

export const deletePost = async (id: string): Promise<boolean> => {
  const index = blogPostsMetadata.findIndex(post => post.id === id);
  if (index === -1) return false;
  
  blogPostsMetadata.splice(index, 1);
  return true;
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'date'>): Promise<Comment | null> => {
  const post = blogPostsMetadata.find(p => p.id === postId);
  if (!post) return null;
  
  const newComment: Comment = {
    ...comment,
    id: `comment-${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  
  post.comments.push(newComment);
  return newComment;
};

export const likePost = async (postId: string): Promise<boolean> => {
  const post = blogPostsMetadata.find(p => p.id === postId);
  if (!post) return false;
  
  post.likes++;
  return true;
};

export const dislikePost = async (postId: string): Promise<boolean> => {
  const post = blogPostsMetadata.find(p => p.id === postId);
  if (!post) return false;
  
  post.dislikes++;
  return true;
};