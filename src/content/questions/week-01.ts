import type { Question } from '../../types'

export const week01Questions: Question[] = [
  {
    id: 'w1-q1',
    prompt: 'What is the main goal of regression testing?',
    choices: [
      'To test brand-new features only',
      'To confirm that recent changes haven\'t broken existing functionality',
      'To measure how fast the application loads',
      'To replace manual testing entirely',
    ],
    correctIndex: 1,
    explanation:
      'Regression testing re-runs existing tests to catch unintended side effects of new changes.',
  },
  {
    id: 'w1-q2',
    prompt: 'Which test level focuses on verifying individual functions or methods in isolation?',
    choices: ['Unit testing', 'System testing', 'User acceptance testing', 'Smoke testing'],
    correctIndex: 0,
    explanation: 'Unit tests target the smallest testable parts of an application in isolation.',
  },
  {
    id: 'w1-q3',
    prompt: 'A "smoke test" is best described as:',
    choices: [
      'An exhaustive test of every edge case',
      'A quick check that the critical paths work before deeper testing',
      'A test that only runs on Fridays',
      'A performance stress test',
    ],
    correctIndex: 1,
    explanation: 'Smoke tests are shallow, fast checks that the build is stable enough to test further.',
  },
  {
    id: 'w1-q4',
    prompt: 'What does "test coverage" measure?',
    choices: [
      'How many bugs were fixed last sprint',
      'How much of the codebase is exercised by tests',
      'How many testers are on the project',
      'The number of test environments available',
    ],
    correctIndex: 1,
    explanation: 'Coverage quantifies what proportion of code paths your tests actually exercise.',
  },
  {
    id: 'w1-q5',
    prompt: 'In the testing pyramid, which layer should typically have the most tests?',
    choices: ['End-to-end UI tests', 'Manual exploratory tests', 'Unit tests', 'Load tests'],
    correctIndex: 2,
    explanation: 'Unit tests are cheap and fast, so they form the broad base of the pyramid.',
  },
  {
    id: 'w1-q6',
    prompt: 'What is a "false positive" in test results?',
    choices: [
      'A test that fails when the feature actually works correctly',
      'A test that passes when the feature is actually broken',
      'A test that never runs',
      'A test written in the wrong language',
    ],
    correctIndex: 1,
    explanation: 'A false positive incorrectly reports success despite an underlying defect.',
  },
  {
    id: 'w1-q7',
    prompt: 'Boundary value analysis is a technique used to:',
    choices: [
      'Test values at the edges of valid input ranges',
      'Test only the average-case input',
      'Skip edge cases to save time',
      'Test UI colors and layout',
    ],
    correctIndex: 0,
    explanation: 'Boundary analysis targets edge values, where defects are most likely to hide.',
  },
  {
    id: 'w1-q8',
    prompt: 'Why are test cases typically written before executing them, rather than improvised on the spot?',
    choices: [
      'To make testing take longer',
      'To ensure repeatability, traceability, and consistent coverage',
      'Because tools require it',
      'It is not actually recommended',
    ],
    correctIndex: 1,
    explanation: 'Documented test cases can be repeated, traced to requirements, and reviewed for coverage.',
  },
]
