import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useHandleSpecialCustomer } from '../SpecialCustomerClousing/useHandleSpecialCustomerData'

// Mocks de los contextos
vi.mock('@context/home/headerContext', () => ({
  useHeaders: vi.fn(),
}))

vi.mock('@context/home/footerClousingContext', () => ({
  useFooter: vi.fn(),
}))

vi.mock('@context/clousing/specialCustClousingContext', () => ({
  useSpecialCustContext: vi.fn(),
}))

vi.mock('@hooks/useDebounce', () => ({
  useDebounce: vi.fn((fn) => fn),
}))

import { useHeaders } from '@context/home/headerContext'
import { useFooter } from '@context/home/footerClousingContext'
import { useSpecialCustContext } from '@context/clousing/specialCustClousingContext'

describe('useHandleSpecialCustomer', () => {
  const mockClousingId = 123
  const mockSetSpecialCustomer = vi.fn()
  
  let mockUpdateTotal: any
  let mockSetFooterData: any
  let mockSetSpecialCustData: any

  // Mock customer data inicial
  const mockSpecialCustomerData: any = {
    lines: [
      {
        id: 1,
        check: 1001,
        guestCheckId: 2001,
        bill: 500,
        couponPrice: 500,
        difference: 0,
        exchangeRate: 20.5,
        client: 'Juan Pérez',
        clientId: 1,
        pax: 2,
        couponFolio: 'FOLIO-001',
        couponFolioUSD: 'USD-001',
        ammount: 0,
        ammountUSD: 24.39,
        flight: 'AM123',
        passengerName: 'Juan Pérez',
        ammountMXN: 500,
      },
      {
        id: 2,
        check: 1002,
        guestCheckId: 2002,
        bill: 300,
        couponPrice: 300,
        difference: 0,
        exchangeRate: 20.5,
        client: 'María López',
        clientId: 2,
        pax: 1,
        couponFolio: 'FOLIO-002',
        couponFolioUSD: 'USD-002',
        ammount: 14.63,
        ammountUSD: 0,
        flight: 'AM456',
        passengerName: 'María López',
        ammountMXN: 300,
      },
    ],
    total: {
      totalPOS: 1000,
      totalPhysical: 800,
      difference: -200,
    },
  }

  // Función helper para obtener el estado actualizado de setSpecialCustomer
  const getUpdatedState = (callIndex: number = 0) => {
    const callArg = mockSetSpecialCustomer.mock.calls[callIndex]?.[0]
    if (typeof callArg === 'function') {
      return callArg(mockSpecialCustomerData)
    }
    return callArg
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    mockUpdateTotal = vi.fn().mockResolvedValue(undefined)
    mockSetFooterData = vi.fn().mockResolvedValue(undefined)
    mockSetSpecialCustData = vi.fn().mockResolvedValue(undefined)

    vi.mocked(useHeaders).mockReturnValue({ updateTotal: mockUpdateTotal } as any)
    vi.mocked(useFooter).mockReturnValue({ setFooterData: mockSetFooterData } as any)
    vi.mocked(useSpecialCustContext).mockReturnValue({ setSpecialCustData: mockSetSpecialCustData } as any)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('updateContext', () => {
    it('debe trabajar siempre con los valores actualizados (referencia)', async () => {
      const { result, rerender } = renderHook(
        ({ specialCustomerData }) => useHandleSpecialCustomer(specialCustomerData, mockSetSpecialCustomer, mockClousingId),
        { initialProps: { specialCustomerData: mockSpecialCustomerData } }
      )

      // Actualizar datos
      const updatedData = {
        ...mockSpecialCustomerData,
        lines: [
          {
            ...mockSpecialCustomerData.lines[0],
            bill: 1000,
            ammountMXN: 1000,
          },
          ...mockSpecialCustomerData.lines.slice(1),
        ],
      }

      rerender({ specialCustomerData: updatedData })

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
    })

    it('debe actualizar los valores numéricos globales del modelo SpecialCustomerModel.Total', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      expect(mockSetSpecialCustomer).toHaveBeenCalled()
      const updatedState = getUpdatedState(0)
      
      // Solo debe sumar líneas con pax >= 1
      const expectedTotalPhysical = mockSpecialCustomerData.lines
        .filter((line: any) => line.pax >= 1)
        .reduce((acc: number, curr: any) => acc + curr.bill, 0)
      
      expect(updatedState.total.totalPhysical).toBe(expectedTotalPhysical)
      expect(updatedState.total.difference).toBe(expectedTotalPhysical - mockSpecialCustomerData.total.totalPOS)
    })

    it('debe actualizar con los valores numéricos correctos los contextos', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      const expectedTotalPhysical = mockSpecialCustomerData.lines
        .filter((line: any) => line.pax >= 1)
        .reduce((acc: number, curr: any) => acc + curr.bill, 0)

      expect(mockUpdateTotal).toHaveBeenCalledWith(
        expectedTotalPhysical,
        mockClousingId,
        'specialCustomer'
      )
      expect(mockSetFooterData).toHaveBeenCalled()
      expect(mockSetSpecialCustData).toHaveBeenCalled()
    })

    it('debe ignorar líneas con pax = 0 en el cálculo del total', async () => {
      const dataWithZeroPax = {
        ...mockSpecialCustomerData,
        lines: [
          ...mockSpecialCustomerData.lines,
          {
            id: 3,
            bill: 1000,
            pax: 0,
            ammountMXN: 1000,
          },
        ],
      }

      const { result } = renderHook(() =>
        useHandleSpecialCustomer(dataWithZeroPax, mockSetSpecialCustomer, mockClousingId)
      )

      await act(async () => {
        result.current.updateContext()
        await vi.runAllTimersAsync()
      })

      const expectedTotalPhysical = dataWithZeroPax.lines
        .filter((line: any) => line.pax >= 1)
        .reduce((acc: number, curr: any) => acc + curr.bill, 0)

      expect(mockUpdateTotal).toHaveBeenCalledWith(
        expectedTotalPhysical,
        mockClousingId,
        'specialCustomer'
      )
      // La línea con pax=0 no debe contribuir al total
      expect(expectedTotalPhysical).not.toContain(1000)
    })
  })

  describe('handleInputTextData', () => {
    it('debe modificar el campo couponFolio', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('NUEVO-FOLIO-001', 1, 'couponFolio')
      })

      expect(mockSetSpecialCustomer).toHaveBeenCalledTimes(1)
      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].couponFolio).toBe('NUEVO-FOLIO-001')
    })

    it('debe modificar el campo couponFolioUSD', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('NUEVO-USD-001', 1, 'couponFolioUSD')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].couponFolioUSD).toBe('NUEVO-USD-001')
    })

    it('debe modificar el campo flight', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('AM999', 1, 'flight')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].flight).toBe('AM999')
    })

    it('debe modificar el campo passengerName', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('Carlos López', 1, 'passengerName')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].passengerName).toBe('Carlos López')
    })

    it('debe actualizar clientId cuando se proporciona', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('Nuevo Valor', 1, 'couponFolio', 999)
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].clientId).toBe(999)
    })

    it('no debe detonar la actualización de los valores numéricos de la línea', () => {
      const originalAmmount = mockSpecialCustomerData.lines[0].ammount
      const originalAmmountUSD = mockSpecialCustomerData.lines[0].ammountUSD
      const originalAmmountMXN = mockSpecialCustomerData.lines[0].ammountMXN
      const originalDifference = mockSpecialCustomerData.lines[0].difference

      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('NUEVO-FOLIO', 1, 'couponFolio')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].ammount).toBe(originalAmmount)
      expect(updatedState.lines[0].ammountUSD).toBe(originalAmmountUSD)
      expect(updatedState.lines[0].ammountMXN).toBe(originalAmmountMXN)
      expect(updatedState.lines[0].difference).toBe(originalDifference)
    })

    it('debe detonar la actualización de contextos', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('NUEVO-FOLIO', 1, 'couponFolio')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
      expect(mockSetSpecialCustData).toHaveBeenCalled()
    })

    it('debe mantener el resto de líneas sin cambios', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('NUEVO-FOLIO', 1, 'couponFolio')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[1].couponFolio).toBe('FOLIO-002')
      expect(updatedState.lines[1].flight).toBe('AM456')
    })
  })

  describe('handleUpdateAmountMXN', () => {
    it('debe aceptar únicamente valores string que tengan conversión válida en number', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, 'abc', 'ammount')
      })

      // No debe actualizar si no hay un número válido
      if (mockSetSpecialCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].ammount).toBe(0)
      }
    })

    it('debe actualizar ammount cuando key es "ammount"', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '100', 'ammount')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].ammount).toBe(100)
      expect(updatedState.lines[0].ammountUSD).toBe(0)
      expect(updatedState.lines[0].ammountMXN).toBe(100)
      expect(updatedState.lines[0].couponPrice).toBe(100)
      expect(updatedState.lines[0].difference).toBe(100 - 500)
    })

    it('debe actualizar ammountUSD cuando key es diferente de "ammount"', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '50', 'ammountUSD')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].ammount).toBe(0)
      expect(updatedState.lines[0].ammountUSD).toBe(50)
      expect(updatedState.lines[0].ammountMXN).toBe(50 * 20.5)
      expect(updatedState.lines[0].couponPrice).toBe(50 * 20.5)
    })

    it('el valor de newValueUSD debe ser 0 cuando ammount sea diferente de 0 y viceversa', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      // Caso 1: Actualizar ammount
      act(() => {
        result.current.handleUpdateAmountMXN(1, '100', 'ammount')
      })

      let updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].ammount).toBe(100)
      expect(updatedState.lines[0].ammountUSD).toBe(0)

      // Caso 2: Actualizar ammountUSD
      act(() => {
        result.current.handleUpdateAmountMXN(2, '30', 'ammountUSD')
      })

      updatedState = getUpdatedState(1)
      expect(updatedState.lines[1].ammount).toBe(0)
      expect(updatedState.lines[1].ammountUSD).toBe(30)
    })

    it('debe detonar la actualización de los valores numéricos de la línea', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '75.5', 'ammountUSD')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[0].ammountMXN).toBe(75.5 * 20.5)
      expect(updatedState.lines[0].couponPrice).toBe(75.5 * 20.5)
      expect(updatedState.lines[0].difference).toBe((75.5 * 20.5) - 500)
    })

    it('debe detonar la actualización de los valores numéricos globales', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '100', 'ammount')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalled()
      expect(mockSetFooterData).toHaveBeenCalled()
      expect(mockSetSpecialCustData).toHaveBeenCalled()
    })

    it('no debe manejar negativos', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '-50', 'ammount')
      })

      // No debe actualizar con valores negativos
      if (mockSetSpecialCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].ammount).toBe(0)
      }
    })

    it('debe rechazar valores negativos en ammountUSD', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '-30', 'ammountUSD')
      })

      if (mockSetSpecialCustomer.mock.calls.length > 0) {
        const updatedState = getUpdatedState(0)
        expect(updatedState.lines[0].ammountUSD).toBe(0) 
      }
    })

    it('debe redondear a 2 decimales', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '100.555', 'ammount')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].ammount).toBe(100.56)
    })

    it('debe calcular correctamente con exchangeRate', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '50', 'ammountUSD')
      })

      const updatedState = getUpdatedState(0)
      const expectedMXN = 50 * 20.5
      expect(updatedState.lines[0].ammountMXN).toBe(expectedMXN)
      expect(updatedState.lines[0].couponPrice).toBe(expectedMXN)
    })

    it('debe mantener el resto de líneas sin cambios', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '100', 'ammount')
      })

      const updatedState = getUpdatedState(0)
      
      expect(updatedState.lines[1].ammount).toBe(14.63)
      expect(updatedState.lines[1].ammountUSD).toBe(0)
    })

    it('debe manejar valores con punto decimal correctamente', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '75.75', 'ammountUSD')
      })

      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[0].ammountUSD).toBe(75.75)
      expect(updatedState.lines[0].ammountMXN).toBe(75.75 * 20.5)
    })
  })

  describe('Integración y casos borde', () => {
    it('debe manejar specialCustomerData vacío/undefined correctamente', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(null as any, mockSetSpecialCustomer, mockClousingId)
      )

      expect(() => {
        act(() => {
          result.current.updateContext()
        })
      }).not.toThrow()
    })

    it('debe manejar múltiples actualizaciones en secuencia', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '100', 'ammount')
        result.current.handleUpdateAmountMXN(2, '50', 'ammountUSD')
        result.current.handleInputTextData('NUEVO-FOLIO', 1, 'couponFolio')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(mockUpdateTotal).toHaveBeenCalledTimes(3)
      expect(mockSetSpecialCustomer).toHaveBeenCalledTimes(3)
    })

    it('debe mantener la consistencia de los cálculos después de múltiples operaciones', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      // Actualizar valores
      act(() => {
        result.current.handleUpdateAmountMXN(1, '200', 'ammount')
        result.current.handleUpdateAmountMXN(2, '75', 'ammountUSD')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verificar que los totales se actualizaron correctamente
      const updatedState = getUpdatedState(1)
      const expectedTotalPhysical = updatedState.lines
        .filter((line: any) => line.pax >= 1)
        .reduce((acc: number, curr: any) => acc + curr.bill, 0)

      expect(mockUpdateTotal).toHaveBeenLastCalledWith(
        expectedTotalPhysical,
        mockClousingId,
        'specialCustomer'
      )
    })

    it('debe manejar valores extremadamente grandes sin romperse', () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '9999999', 'ammount')
      })

      expect(() => {
        act(() => {
          result.current.updateContext()
        })
      }).not.toThrow()
    })

    it('debe manejar múltiples cambios en el mismo cliente antes del debounce', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleUpdateAmountMXN(1, '50', 'ammount')
        result.current.handleUpdateAmountMXN(1, '75', 'ammount')
        result.current.handleUpdateAmountMXN(1, '100', 'ammount')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const updatedState = getUpdatedState(2)
      expect(updatedState.lines[0].ammount).toBe(100)
    })

    it('debe manejar la combinación de texto y números correctamente', async () => {
      const { result } = renderHook(() =>
        useHandleSpecialCustomer(mockSpecialCustomerData, mockSetSpecialCustomer, mockClousingId)
      )

      act(() => {
        result.current.handleInputTextData('VUELO-999', 1, 'flight')
        result.current.handleUpdateAmountMXN(1, '150', 'ammount')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const updatedState = getUpdatedState(1)
      expect(updatedState.lines[0].flight).toBe('VUELO-999')
      expect(updatedState.lines[0].ammount).toBe(150)
    })

    it('debe manejar líneas con pax = 0 correctamente', async () => {
      const dataWithZeroPax = {
        ...mockSpecialCustomerData,
        lines: [
          ...mockSpecialCustomerData.lines,
          {
            id: 3,
            bill: 1000,
            pax: 0,
            ammountMXN: 1000,
            exchangeRate: 20.5,
          },
        ],
      }

      const { result } = renderHook(() =>
        useHandleSpecialCustomer(dataWithZeroPax, mockSetSpecialCustomer, mockClousingId)
      )

      // Actualizar la línea con pax=0
      act(() => {
        result.current.handleUpdateAmountMXN(3, '500', 'ammount')
      })

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // La línea con pax=0 debe actualizar sus valores pero no afectar el total global
      const updatedState = getUpdatedState(0)
      expect(updatedState.lines[2].ammount).toBe(500)
      
      const totalPhysical = updatedState.lines
        .filter((line: any) => line.pax >= 1)
        .reduce((acc: number, curr: any) => acc + curr.bill, 0)
      
      expect(mockUpdateTotal).toHaveBeenCalledWith(
        totalPhysical,
        mockClousingId,
        'SPECIALCUSTOMER'
      )
      expect(totalPhysical).not.toContain(500)
    })
  })
})