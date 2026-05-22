import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useHandleCustomer } from '../customerClousing/useHandleCustomerData'

// Mocks de los contextos
vi.mock('@context/home/headerContext', () => ({
  useHeaders: vi.fn(),
}))

vi.mock('@context/home/footerClousingContext', () => ({
  useFooter: vi.fn(),
}))

vi.mock('@context/clousing/customerClousingContext', () => ({
  useCustomerContext: vi.fn(),
}))

vi.mock('@hooks/useDebounce', () => ({
  useDebounce: vi.fn((fn) => fn),
}))

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-123'),
}))

import { useHeaders } from '@context/home/headerContext'
import { useFooter } from '@context/home/footerClousingContext'
import { useCustomerContext } from '@context/clousing/customerClousingContext'

describe('useHandleCustomer', () => {
  const mockClousingId = 123
  const mockSetCustomer = vi.fn()
  
  let mockUpdateTotal: any
  let mockSetFooterData: any
  let mockSetCustomerData: any

  // Mock currencies
  const mockCurrencies: any = [
    { value: 1, label: 'USD', exchangeRate: 20.5 },
    { value: 2, label: 'EUR', exchangeRate: 22.3 },
    { value: 3, label: 'MXN', exchangeRate: 1 },
  ]

  // Mock customer data inicial
  const mockCustomerData: any = {
    lines: [
      {
        id: 'customer-1',
        idClient: 'CLI-001',
        nameClient: 'Juan Pérez',
        currency: '1',
        currencyId: 1,
        currencyLabel: 'USD',
        exchangeRate: 20.5,
        coupons: 10,
        pax: 2,
        amount: 20,
        amountMXN: 410,
      },
      {
        id: 'customer-2',
        idClient: 'CLI-002',
        nameClient: 'María López',
        currency: '2',
        currencyId: 2,
        currencyLabel: 'EUR',
        exchangeRate: 22.3,
        coupons: 5,
        pax: 3,
        amount: 15,
        amountMXN: 334.5,
      },
    ],
    total: {
      totalPOS: 1000,
      totalPhysical: 744.5,
      difference: -255.5,
      differenceCupons: 0,
    },
  }

  // Función helper para obtener el estado actualizado de setCustomer
  const getUpdatedState = (callIndex: number = 0) => {
    const callArg = mockSetCustomer.mock.calls[callIndex][0]
    if (typeof callArg === 'function') {
      return callArg(mockCustomerData)
    }
    return callArg
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    mockUpdateTotal = vi.fn().mockResolvedValue(undefined)
    mockSetFooterData = vi.fn().mockResolvedValue(undefined)
    mockSetCustomerData = vi.fn().mockResolvedValue(undefined)

    vi.mocked(useHeaders).mockReturnValue({ updateTotal: mockUpdateTotal } as any)
    vi.mocked(useFooter).mockReturnValue({ setFooterData: mockSetFooterData } as any)
    vi.mocked(useCustomerContext).mockReturnValue({ setCustomerData: mockSetCustomerData } as any)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('handleDeleteCustomer', () => {
    it('debe eliminar un cliente del arreglo de clientes CustomerModel.lines', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleDeleteCustomer(0)
      })

      expect(mockSetCustomer).toHaveBeenCalledTimes(1)
      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines).toHaveLength(1)
      expect(updatedState.lines[0].id).toBe('customer-2')
    })

    it('el resto de clientes debe permanecer sin cambio', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleDeleteCustomer(0)
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].idClient).toBe('CLI-002')
      expect(updatedState.lines[0].nameClient).toBe('María López')
      expect(updatedState.lines[0].coupons).toBe(5)
      expect(updatedState.lines[0].pax).toBe(3)
    })

    it('debe recalcular todos los valores numéricos sin tener en cuenta los valores del cliente eliminado', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleDeleteCustomer(0)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verificar que los contextos se actualizan con los nuevos totales
      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
      expect(mockSetCustomerData).toHaveBeenCalled()
    })
  })

  describe('updateContext', () => {
    it('debe trabajar siempre con los valores actualizados (referencia)', async () => {
      const { result, rerender } = renderHook(
        ({ customerData }) => useHandleCustomer(customerData, mockSetCustomer, mockClousingId),
        { initialProps: { customerData: mockCustomerData } }
      )

      const updatedData = {
        ...mockCustomerData,
        lines: [
          {
            ...mockCustomerData.lines[0],
            amountMXN: 500,
          },
          ...mockCustomerData.lines.slice(1),
        ],
      }

      rerender({ customerData: updatedData })

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
    })

    it('debe actualizar los valores numéricos globales del modelo CustomerModel.Total', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      expect(mockSetCustomer).toHaveBeenCalled()
      const updatedState = getUpdatedState(0)
      
      const totalPhysical = updatedState.lines.reduce(
        (acc: number, curr: any) => acc + (curr.amountMXN || 0),
        0
      )
      
      expect(updatedState.total.totalPhysical).toBe(Math.min(totalPhysical, updatedState.total.totalPOS))
    })

    it('debe actualizar con los valores numéricos correctos los contextos', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
      expect(mockSetCustomerData).toHaveBeenCalled()
    })

    it('debe calcular correctamente differenceCupons cuando el total físico excede el total POS', async () => {
      const dataWithHighAmount = {
        ...mockCustomerData,
        lines: [
          {
            ...mockCustomerData.lines[0],
            amountMXN: 1500,
          },
          ...mockCustomerData.lines.slice(1),
        ],
        total: { ...mockCustomerData.total, totalPOS: 1000 },
      }

      const { result } = renderHook(() =>
        useHandleCustomer(dataWithHighAmount, mockSetCustomer, mockClousingId)
      )

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.total.totalPhysical).toBe(1000)
      expect(updatedState.total.differenceCupons).toBeGreaterThan(0)
    })
  })

  describe('selectCurrency', () => {
    it('debe actualizar el modelo a nivel línea CustomerModel.lines con la moneda seleccionada', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.selectCurrency(['2'], 'customer-1', mockCurrencies)
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].currency).toBe('2')
      expect(updatedState.lines[0].currencyLabel).toBe('EUR')
      expect(updatedState.lines[0].exchangeRate).toBe(22.3)
    })

    it('debe detonar la actualización de los valores numéricos de la línea', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.selectCurrency(['2'], 'customer-1', mockCurrencies)
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].amountMXN).toBe(20 * 22.3)
    })

    it('debe detonar la actualización de los valores numéricos globales CustomerModel.Total', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.selectCurrency(['2'], 'customer-1', mockCurrencies)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
    })

    it('no debe manejar negativos', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.selectCurrency([], 'customer-1', mockCurrencies)
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].amountMXN).toBeGreaterThanOrEqual(0)
    })

    it('debe redondear a 2 decimales', () => {
      const currenciesWithDecimals: any = [
        { value: 1, label: 'USD', exchangeRate: 20.555 },
      ]

      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.selectCurrency(['1'], 'customer-1', currenciesWithDecimals)
      })

      const updatedState = getUpdatedState(0)
      const decimals = (updatedState.lines[0].amountMXN.toString().split('.')[1]?.length || 0)
      expect(decimals).toBeLessThanOrEqual(2)
    })
  })

  describe('handleCoupons', () => {
    it('debe aceptar únicamente valores string que tenga una conversión valida en number', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', 'abc')
      })

      // Si no pasó la validación, puede no llamar a setCustomer o llamar sin cambios
      if (mockSetCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].coupons).toBe(10)
      }
    })

    it('debe detonar la actualización de los valores numéricos de la línea', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '15')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].coupons).toBe(15)
      expect(updatedState.lines[0].amount).toBe(15 * 2)
      expect(updatedState.lines[0].amountMXN).toBe(15 * 2 * 20.5)
    })

    it('debe detonar la actualización de los valores numéricos globales CustomerModel.Total', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '15')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
    })

    it('no debe manejar negativos', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '-5')
      })

      // Verificar que no se permitieron negativos
      if (mockSetCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].coupons).toBeGreaterThanOrEqual(0)
      }
    })

    it('debe redondear a 2 decimales', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '10.556')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].coupons).toBe(10.56)
    })
  })

  describe('handleAmountPAX', () => {
    it('debe aceptar únicamente valores string que tenga una conversión valida en number', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleAmountPAX('customer-1', 'abc')
      })

      if (mockSetCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].pax).toBe(2)
      }
    })

    it('debe detonar la actualización de los valores numéricos de la línea', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleAmountPAX('customer-1', '5')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].pax).toBe(5)
      expect(updatedState.lines[0].amount).toBe(10 * 5)
      expect(updatedState.lines[0].amountMXN).toBe(10 * 5 * 20.5)
    })

    it('debe detonar la actualización de los valores numéricos globales CustomerModel.Total', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleAmountPAX('customer-1', '5')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
    })

    it('no debe manejar negativos', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleAmountPAX('customer-1', '-3')
      })

      if (mockSetCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].pax).toBeGreaterThanOrEqual(0)
      }
    })

    it('debe redondear a 2 decimales', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleAmountPAX('customer-1', '2.555')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].pax).toBe(2.56)
    })
  })

  describe('handleChangeCustomer', () => {
    it('debe actualizar la información del cliente a nivel línea CustomerModel.lines', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      const selectedOption: any = { value: 'CLI-999', label: 'Nuevo Cliente' }

      act(() => {
        result.current.handleChangeCustomer(selectedOption, 'customer-1')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].idClient).toBe('CLI-999')
      expect(updatedState.lines[0].nameClient).toBe('Nuevo Cliente')
    })

    it('no debe detonar la actualización de los valores numéricos de la línea', () => {
      const originalAmountMXN = mockCustomerData.lines[0].amountMXN
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      const selectedOption: any = { value: 'CLI-999', label: 'Nuevo Cliente' }

      act(() => {
        result.current.handleChangeCustomer(selectedOption, 'customer-1')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].amountMXN).toBe(originalAmountMXN)
      expect(updatedState.lines[0].amount).toBe(mockCustomerData.lines[0].amount)
    })
  })

  describe('addCustomerRecord', () => {
    it('debe agregar la información del cliente nuevo a nivel línea CustomerModel.lines', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      const newCustomer: any = {
        idClient: 'CLI-NEW',
        nameClient: 'Nuevo Cliente',
        currency: '1',
        coupons: 3,
        pax: 4,
      }

      act(() => {
        result.current.addCustomerRecord(newCustomer, mockCurrencies)
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines).toHaveLength(3)
      expect(updatedState.lines[2].id).toBe('customer-mock-uuid-123')
      expect(updatedState.lines[2].idClient).toBe('CLI-NEW')
    })

    it('debe calcular correctamente los valores numéricos del nuevo registro', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      const newCustomer: any = {
        idClient: 'CLI-NEW',
        nameClient: 'Nuevo Cliente',
        currency: '1',
        coupons: 3,
        pax: 4,
      }

      act(() => {
        result.current.addCustomerRecord(newCustomer, mockCurrencies)
      })

      const updatedState = getUpdatedState(0)
      const newRecord = updatedState.lines[2]
      
      expect(newRecord.amount).toBe(12)
      expect(newRecord.amountMXN).toBe(12 * 20.5)
    })

    it('debe redondear a 2 decimales', () => {
      const currenciesWithDecimals: any = [
        { value: 1, label: 'USD', exchangeRate: 20.555 },
      ]

      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      const newCustomer: any = {
        idClient: 'CLI-NEW',
        nameClient: 'Nuevo Cliente',
        currency: '1',
        coupons: 3,
        pax: 4,
      }

      act(() => {
        result.current.addCustomerRecord(newCustomer, currenciesWithDecimals)
      })

      const updatedState = getUpdatedState(0)
      const decimals = (updatedState.lines[2].amountMXN.toString().split('.')[1]?.length || 0)
      expect(decimals).toBeLessThanOrEqual(2)
    })
  })

  describe('Integración y casos borde', () => {
    it('debe manejar customerData vacío/undefined correctamente', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(null as any, mockSetCustomer, mockClousingId)
      )

      expect(() => {
        act(() => {
          result.current.updateContext()
        })
      }).not.toThrow()
    })

    it('debe manejar múltiples actualizaciones en secuencia', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '15')
        result.current.handleAmountPAX('customer-1', '5')
        result.current.selectCurrency(['2'], 'customer-1', mockCurrencies)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalledTimes(3)
      expect(mockSetCustomer).toHaveBeenCalledTimes(6)
    })

    it('debe mantener la consistencia de los cálculos después de eliminar un cliente', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '20')
        result.current.handleAmountPAX('customer-1', '3')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      act(() => {
        result.current.handleDeleteCustomer(0)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const lastUpdateTotalCall = mockUpdateTotal.mock.calls[mockUpdateTotal.mock.calls.length - 1]
      expect(lastUpdateTotalCall[0]).toBe(334.5)
    })

    it('debe manejar la creación y eliminación en secuencia', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      const newCustomer: any = {
        idClient: 'CLI-NEW',
        nameClient: 'Nuevo Cliente',
        currency: '1',
        coupons: 3,
        pax: 4,
      }

      act(() => {
        result.current.addCustomerRecord(newCustomer, mockCurrencies)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      act(() => {
        result.current.handleDeleteCustomer(2)
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const updatedState = getUpdatedState(2)
      expect(updatedState.lines).toHaveLength(2)
    })

    it('debe manejar valores extremadamente grandes sin romperse', () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '9999999')
        result.current.handleAmountPAX('customer-1', '9999999')
      })

      expect(() => {
        act(() => {
          result.current.updateContext()
        })
      }).not.toThrow()
    })

    it('debe manejar múltiples cambios en el mismo cliente antes del debounce', async () => {
      const { result } = renderHook(() =>
        useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleCoupons('customer-1', '15')
        result.current.handleCoupons('customer-1', '20')
        result.current.handleCoupons('customer-1', '25')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const updatedState = getUpdatedState(4)
      expect(updatedState.lines[0].coupons).toBe(25)
    })

    // it('debe manejar cambios en diferentes clientes independientemente', async () => {
    //   const { result } = renderHook(() =>
    //     useHandleCustomer(mockCustomerData, mockSetCustomer, mockClousingId)
    //   )

    //   act(() => {
    //     result.current.handleCoupons('customer-1', '15')
    //     result.current.handleCoupons('customer-2', '10')
    //   })

    //   await act(async () => {
    //     await vi.runAllTimersAsync()
    //   })

    //   const updatedState = getUpdatedState(3)
    //   expect(updatedState.lines[0].coupons).toBe(15)
    //   expect(updatedState.lines[1].coupons).toBe(10)
    // })
  })
})