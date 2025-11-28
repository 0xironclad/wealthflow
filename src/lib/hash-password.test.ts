import { describe, it, expect, vi } from 'vitest'
import { hashPassword, comparePassword } from './hash-password'
import bcrypt from 'bcryptjs'

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    genSalt: vi.fn(),
    hash: vi.fn(),
    compare: vi.fn(),
  },
}))

describe('hashPassword', () => {
  it('should hash a password', async () => {
    const mockSalt = 'mock-salt'
    const mockHash = 'hashed-password'

    vi.mocked(bcrypt.genSalt).mockResolvedValueOnce(mockSalt as never)
    vi.mocked(bcrypt.hash).mockResolvedValueOnce(mockHash as never)

    const result = await hashPassword('plain-password')

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
    expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', mockSalt)
    expect(result).toBe(mockHash)
  })

  it('should handle errors during hashing', async () => {
    const error = new Error('Hashing failed')
    vi.mocked(bcrypt.genSalt).mockRejectedValueOnce(error)

    await expect(hashPassword('plain-password')).rejects.toThrow('Hashing failed')
  })
})

describe('comparePassword', () => {
  it('should return true for matching passwords', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(true as never)

    const result = await comparePassword('plain-password', 'hashed-password')

    expect(bcrypt.compare).toHaveBeenCalledWith('plain-password', 'hashed-password')
    expect(result).toBe(true)
  })

  it('should return false for non-matching passwords', async () => {
    vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never)

    const result = await comparePassword('wrong-password', 'hashed-password')

    expect(bcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
    expect(result).toBe(false)
  })

  it('should handle errors during comparison', async () => {
    const error = new Error('Comparison failed')
    vi.mocked(bcrypt.compare).mockRejectedValueOnce(error)

    await expect(comparePassword('password', 'hash')).rejects.toThrow('Comparison failed')
  })
})

