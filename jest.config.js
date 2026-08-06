const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)()

  // Override transformIgnorePatterns so ESM-only packages (next-intl v4,
  // use-intl) are transformed by SWC. next/jest prepends `/node_modules/`
  // which would otherwise ignore everything.
  // https://github.com/vercel/next.js/issues/40183
  config.transformIgnorePatterns = [
    "/node_modules/(?!(next-auth|@auth/core|@auth/prisma-adapter|next-intl|use-intl|intl-messageformat|@formatjs)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ]

  return config
}
