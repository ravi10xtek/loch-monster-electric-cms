// Server-side localStorage polyfill
// Node.js doesn't have localStorage — this prevents Payload's admin UI
// from throwing when it references localStorage during SSR.

export async function register() {
  if (
    typeof globalThis.localStorage === 'undefined' ||
    typeof (globalThis as any).localStorage.getItem !== 'function'
  ) {
    const store: Record<string, string> = {}
    ;(globalThis as any).localStorage = {
      getItem: (key: string): string | null => store[key] ?? null,
      setItem: (key: string, value: string): void => { store[key] = String(value) },
      removeItem: (key: string): void => { delete store[key] },
      clear: (): void => { Object.keys(store).forEach(k => delete store[k]) },
      key: (index: number): string | null => Object.keys(store)[index] ?? null,
      get length(): number { return Object.keys(store).length },
    }
  }
}
