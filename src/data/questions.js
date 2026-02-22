const TOPICS = ['Java', 'JavaScript', 'HTML', 'CSS', 'SQL', 'React', 'Spring Boot', 'Node.js', 'Linux', 'System Design'];
const LEVELS = ['Easy', 'Medium', 'Hard'];
const CONTEXT_PHRASES = [
  'in a production project',
  'during a technical interview',
  'while designing a scalable feature',
  'for a maintainable codebase',
  'in a real application workflow',
  'when optimizing performance',
];

const QUESTION_TEMPLATES = {
  Java: [
    'How would you explain the difference between overloading and overriding',
    'When should you use an interface instead of an abstract class',
    'How does Java memory management impact backend performance',
    'What is the safest way to handle exceptions in service layers',
    'How do collections choices affect runtime complexity',
    'When is immutability useful in Java domain models',
    'How does dependency injection improve testability',
    'What tradeoffs exist between checked and unchecked exceptions',
  ],
  JavaScript: [
    'How does event loop behavior affect asynchronous code execution',
    'When should promises be preferred over callback-based flows',
    'How can closure usage lead to hidden state bugs',
    'What is the practical difference between let, const, and var',
    'How do you avoid race conditions in API-heavy interfaces',
    'When is debouncing better than throttling',
    'How should error handling be structured in async functions',
    'What is the safest approach for parsing external JSON data',
  ],
  HTML: [
    'How does semantic markup improve accessibility and SEO',
    'When should sectioning elements be preferred over generic containers',
    'How do form attributes affect browser validation behavior',
    'Why is alt text critical in image-heavy content pages',
    'How should heading hierarchy be structured for screen readers',
    'When do ARIA roles help and when do they create noise',
    'How can you structure reusable HTML layouts for component-based UIs',
    'What HTML decisions improve performance on low-end devices',
  ],
  CSS: [
    'How do Flexbox and Grid differ for responsive layouts',
    'When should utility classes be preferred over long selectors',
    'How do stacking contexts cause unexpected z-index behavior',
    'What is the cleanest way to scale typography across devices',
    'How can CSS variables improve design system consistency',
    'When is absolute positioning a poor layout strategy',
    'How do media queries support mobile-first development',
    'What styling patterns reduce long-term maintenance cost',
  ],
  SQL: [
    'How do joins impact query performance on large tables',
    'When should indexes be added and when should they be avoided',
    'How does GROUP BY interact with HAVING in analytics queries',
    'What approach ensures safe updates in transactional workflows',
    'How can query plans be used to diagnose slow endpoints',
    'When is normalization more useful than denormalization',
    'How do you prevent duplicate rows in relational schemas',
    'What SQL pattern is best for paginating large result sets',
  ],
  React: [
    'How should state be split between local and global layers',
    'When is memoization worth applying in React components',
    'How do effects create bugs when dependency arrays are wrong',
    'What is the right way to structure reusable form logic',
    'How can rendering performance be improved in large lists',
    'When should context be used instead of prop drilling',
    'How do controlled and uncontrolled components differ in behavior',
    'What component patterns make UI modules easier to test',
  ],
  'Spring Boot': [
    'How does dependency injection work in Spring Boot service design',
    'When should configuration be externalized in Spring Boot apps',
    'How do profiles help manage different deployment environments',
    'What is the role of Spring Data JPA in production APIs',
    'How should exception handling be centralized in REST services',
    'When should asynchronous execution be used in backend workflows',
    'How can actuator endpoints support operational monitoring',
    'What patterns improve controller-service-repository separation',
  ],
  'Node.js': [
    'How does the event loop impact API throughput in Node.js',
    'When should middleware be separated into reusable modules',
    'How do you structure error handling in Express services',
    'What are safe practices for environment variable management',
    'How can Node.js apps prevent blocking operations in requests',
    'When should worker threads be considered for CPU-heavy tasks',
    'How do streams improve memory efficiency for large payloads',
    'What architecture patterns help scale Node.js services',
  ],
  Linux: [
    'How do file permissions affect service security on Linux',
    'What commands are useful for debugging production server issues',
    'How can process management improve system reliability',
    'When should systemd units be used for application services',
    'How do logs help trace failures in distributed environments',
    'What networking checks are critical during API downtime',
    'How should package updates be handled in stable servers',
    'What Linux practices improve deployment automation',
  ],
  'System Design': [
    'How would you design a scalable URL shortener service',
    'When should caching be introduced in read-heavy systems',
    'How do you choose between SQL and NoSQL in product design',
    'What tradeoffs exist between consistency and availability',
    'How should API rate limiting be implemented at scale',
    'How do message queues improve reliability in async workflows',
    'What is the role of load balancers in high-traffic systems',
    'How do you design monitoring for fault-tolerant architectures',
  ],
};

const KEYWORD_POOLS = {
  Java: ['inheritance', 'interface', 'abstraction', 'exception', 'jvm', 'collection', 'polymorphism', 'immutable'],
  JavaScript: ['event loop', 'promise', 'closure', 'async', 'scope', 'json', 'throttle', 'debounce'],
  HTML: ['semantic', 'accessibility', 'form', 'aria', 'heading', 'alt', 'structure', 'section'],
  CSS: ['flexbox', 'grid', 'media query', 'specificity', 'z-index', 'variables', 'responsive', 'layout'],
  SQL: ['join', 'index', 'group by', 'having', 'transaction', 'normalization', 'pagination', 'query plan'],
  React: ['state', 'hooks', 'context', 'memoization', 'effect', 'render', 'component', 'props'],
  'Spring Boot': ['bean', 'autowiring', 'profile', 'jpa', 'controller', 'service', 'actuator', 'configuration'],
  'Node.js': ['event loop', 'middleware', 'express', 'async', 'stream', 'worker', 'runtime', 'non-blocking'],
  Linux: ['permissions', 'process', 'systemd', 'logs', 'network', 'shell', 'service', 'deployment'],
  'System Design': ['scalability', 'cache', 'database', 'queue', 'load balancer', 'consistency', 'availability', 'latency'],
};

function pickDifficulty(index) {
  return LEVELS[index % LEVELS.length];
}

function buildOptions(topic, difficulty) {
  return [
    `${topic} ${difficulty} approach A`,
    `${topic} ${difficulty} approach B`,
    `${topic} ${difficulty} approach C`,
    `${topic} ${difficulty} approach D`,
  ];
}

function buildQuestion(id, category, difficulty) {
  const options = buildOptions(category, difficulty);
  const correctIdx = id % 4;
  const templates = QUESTION_TEMPLATES[category];
  const keywordPool = KEYWORD_POOLS[category];
  const template = templates[(id - 1) % templates.length];
  const context = CONTEXT_PHRASES[(id - 1) % CONTEXT_PHRASES.length];
  const keywords = [
    keywordPool[(id - 1) % keywordPool.length],
    keywordPool[id % keywordPool.length],
    keywordPool[(id + 1) % keywordPool.length],
  ];
  const shortTitle = `${template.split(' ').slice(0, 6).join(' ')}...`;
  const teaser = 'Open this problem to read full statement and solve.';
  const hints = [
    `Think about the role of ${keywords[0]} in real projects.`,
    `Your answer should mention ${keywords[1]} with one practical case.`,
    `Explain how ${keywords[2]} affects implementation decisions.`,
  ];

  return {
    id,
    category,
    difficulty,
    shortTitle,
    title: template,
    teaser,
    question: `${template} ${context}. Write a concise but practical answer with reasoning and one example.`,
    keywords,
    hints,
    options,
    answer: options[correctIdx],
  };
}

function generateQuestionBank(targetCount = 1000) {
  const list = [];
  for (let i = 1; i <= targetCount; i += 1) {
    const category = TOPICS[(i - 1) % TOPICS.length];
    const difficulty = pickDifficulty(i);
    list.push(buildQuestion(i, category, difficulty));
  }
  return list;
}

function generateMockQuestionBank(startId = 10001, perTopic = 15) {
  const list = [];
  let currentId = startId;

  TOPICS.forEach((topic) => {
    for (let i = 1; i <= perTopic; i += 1) {
      const difficulty = pickDifficulty(i + topic.length);
      const options = [
        `${topic} Mock scenario ${i} - Choice A`,
        `${topic} Mock scenario ${i} - Choice B`,
        `${topic} Mock scenario ${i} - Choice C`,
        `${topic} Mock scenario ${i} - Choice D`,
      ];
      const correctIdx = (i + topic.length) % 4;

      list.push({
        id: currentId,
        category: topic,
        difficulty,
        question: `Mock Interview ${topic} problem #${i}: choose the best answer for this interview-style case.`,
        options,
        answer: options[correctIdx],
      });

      currentId += 1;
    }
  });

  return list;
}

export const QUESTION_BANK = generateQuestionBank(1000);
export const MOCK_QUESTION_BANK = generateMockQuestionBank(10001, 15);

export const CATEGORIES = ['All', ...new Set(QUESTION_BANK.map((q) => q.category))];
export const DIFFICULTIES = ['All', ...new Set(QUESTION_BANK.map((q) => q.difficulty))];
