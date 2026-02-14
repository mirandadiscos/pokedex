import { describe, expect, it } from 'vitest'

import { buildQueryParams, serializeQueryKey } from '../src/utils/queryParams'

describe('queryParams utils', () => {
  it('buildQueryParams ignora valores vazios e serializa os restantes', () => {
    const params = buildQueryParams({
      page: 2,
      search: 'pikachu',
      empty: '',
      nullable: null,
      missing: undefined,
      legendary: false,
    })

    expect(params.toString()).toBe('page=2&search=pikachu&legendary=false')
  })

  it('serializeQueryKey gera chave estável ordenada por nome da propriedade', () => {
    const first = serializeQueryKey({ search: 'bulbasaur', page: 1, pageSize: 9 })
    const second = serializeQueryKey({ pageSize: 9, page: 1, search: 'bulbasaur' })

    expect(first).toBe('page=1&pageSize=9&search=bulbasaur')
    expect(second).toBe(first)
  })
})
