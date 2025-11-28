import { describe, it, expect } from 'vitest'
import { signUpSchema, signInSchema } from './auth-schema'

describe('signUpSchema', () => {
  it('should validate correct sign up data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    }

    const result = signUpSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('should reject name shorter than 2 characters', () => {
    const invalidData = {
      name: 'J',
      email: 'john@example.com',
      password: 'password123',
    }

    const result = signUpSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 2 characters')
    }
  })

  it('should reject name longer than 50 characters', () => {
    const invalidData = {
      name: 'A'.repeat(51),
      email: 'john@example.com',
      password: 'password123',
    }

    const result = signUpSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('not be more than 50 characters')
    }
  })

  it('should reject invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123',
    }

    const result = signUpSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('valid email')
    }
  })

  it('should reject password shorter than 8 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'short',
    }

    const result = signUpSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 8 characters')
    }
  })

  it('should reject password longer than 50 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'A'.repeat(51),
    }

    const result = signUpSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('not be more than 50 characters')
    }
  })
})

describe('signInSchema', () => {
  it('should validate correct sign in data', () => {
    const validData = {
      email: 'john@example.com',
      password: 'password123',
    }

    const result = signInSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual(validData)
    }
  })

  it('should only require email and password', () => {
    const validData = {
      email: 'john@example.com',
      password: 'password123',
    }

    const result = signInSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).not.toHaveProperty('name')
    }
  })

  it('should reject invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
    }

    const result = signInSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('should reject short password', () => {
    const invalidData = {
      email: 'john@example.com',
      password: 'short',
    }

    const result = signInSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

