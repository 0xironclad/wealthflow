import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDebounce from './debounce'

describe('useDebounce hook', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('test', 500))
        expect(result.current).toBe('test')
    })

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 },
            }
        )

        expect(result.current).toBe('initial')

        act(() => {
            rerender({ value: 'updated', delay: 500 })
        })
        expect(result.current).toBe('initial')

        act(() => {
            vi.advanceTimersByTime(500)
        })
        expect(result.current).toBe('updated')
    })

    it('should use custom delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 1000 },
            }
        )

        act(() => {
            rerender({ value: 'updated', delay: 1000 })
        })
        expect(result.current).toBe('initial')

        act(() => {
            vi.advanceTimersByTime(500)
        })
        expect(result.current).toBe('initial')

        act(() => {
            vi.advanceTimersByTime(500)
        })
        expect(result.current).toBe('updated')
    })

    it('should cancel previous timeout on rapid changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 },
            }
        )

        expect(result.current).toBe('initial')

        // Set 'first' and advance partially
        act(() => {
            rerender({ value: 'first', delay: 500 })
        })
        expect(result.current).toBe('initial')

        act(() => {
            vi.advanceTimersByTime(200)
        })
        expect(result.current).toBe('initial')

        // Set 'second' - should cancel 'first' timeout
        act(() => {
            rerender({ value: 'second', delay: 500 })
        })
        expect(result.current).toBe('initial')

        act(() => {
            vi.advanceTimersByTime(200)
        })
        expect(result.current).toBe('initial')

        // Set 'third' - should cancel 'second' timeout
        act(() => {
            rerender({ value: 'third', delay: 500 })
        })
        expect(result.current).toBe('initial')

        // Advance full delay - should update to 'third'
        act(() => {
            vi.advanceTimersByTime(500)
        })
        expect(result.current).toBe('third')
    })

    it('should handle number values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 0, delay: 500 },
            }
        )

        expect(result.current).toBe(0)

        act(() => {
            rerender({ value: 100, delay: 500 })
        })
        expect(result.current).toBe(0)

        act(() => {
            vi.advanceTimersByTime(500)
        })
        expect(result.current).toBe(100)
    })
})

