module.exports = {
    preset: 'jest-playwright-preset',
    testMatch: ["<rootDir>/tests/jest/**/*.test.cjs"],
    testEnvironment: "node",
    setupFilesAfterEnv: ["expect-playwright"],
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "<rootDir>/front/**/*.svelte",
        "<rootDir>/front/**/*.js"
      ],
    collectCoverage: true,
    transform: {
        "^.+\\.svelte$": ["./front/node_modules/svelte-jester/dist/transformer.cjs", { preprocess: true }]
      },
  };
  