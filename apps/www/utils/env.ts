import z from 'zod'

const envSchema = z.object({
  SPECKLE_SERVER_URL: z.string().url(),
  SPECKLE_WORKSPACE_ID: z.string(),
  SPECKLE_WORKSPACE_ADMIN_TOKEN: z.string(),
  SPECKLE_APP_ID: z.string(),
  SPECKLE_APP_SECRET: z.string(),
  SPECKLE_APP_CHALLENGE: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.coerce.number(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
  AUTH_SECRET: z.string()
})

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SPECKLE_SERVER_URL: z.string().url(),
  NEXT_PUBLIC_SPECKLE_APP_ID: z.string(),
  NEXT_PUBLIC_SPECKLE_APP_CHALLENGE: z.string(),
})


export const getEnv = () => envSchema.parse(process.env)
export const getPublicEnv = () => publicEnvSchema.parse({
  NEXT_PUBLIC_SPECKLE_SERVER_URL: process.env.NEXT_PUBLIC_SPECKLE_SERVER_URL,
  NEXT_PUBLIC_SPECKLE_APP_ID: process.env.NEXT_PUBLIC_SPECKLE_APP_ID,
  NEXT_PUBLIC_SPECKLE_APP_CHALLENGE: process.env.NEXT_PUBLIC_SPECKLE_APP_CHALLENGE
})