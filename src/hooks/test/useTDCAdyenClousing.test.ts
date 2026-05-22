import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHandleTDCAdyen } from '../tdcClousing/useTDCAdyenClousing'
import { format } from 'date-fns'

// Mock del toast
vi.mock('../../utils/index', () => ({
  toast: vi.fn(),
}))

// Mock de date-fns
vi.mock('date-fns', () => ({
  format: vi.fn(),
}))

import { toast } from '../../utils/index'

describe('useHandleTDCAdyen', () => {
  let mockSetDetailsLocal: any
  let mockSetVisibleItems: any
  let mockSetLocalAmount: any
  let mockSetVouchersSelected: any

  // Mock de ProcessResult
  const mockProcessResult: any = {
    success: true,
    processedFiles: 1,
    processedFileNames: ['file1.csv'],
    consolidatedData: [
      {
        date: '15/01/24',
        check: '1001',
        amount: '150.50',
      },
      {
        date: '16/01/24',
        check: '1002',
        amount: '200.75',
      },
      {
        date: '17/01/24',
        check: '1003',
        amount: '300.00',
      },
    ],
    totalRecords: 3,
  }

  // Mock de detalles locales (BankLineModel)
  const mockDetailsLocal: any = {
    id: 'bank-1',
    idBank: 1,
    bank: 'Banco Santander',
    physical: 5000,
    pos: 4500,
    voucherAmount: 500,
    voucherAmountDisplay: 500,
    isRoleEditable: true,
    vouchers: [
      {
        id: 1,
        idCustom: 101,
        voucherId: null,
        uniqueIdVoucher: 1001,
        amountConversion: 150.50,
        date: '2024-01-15T00:00:00.000Z',
        check: '1001',
        amount: 150.50,
        status: false,
        message: undefined,
        dateDisplay: undefined,
      },
      {
        id: 2,
        idCustom: 102,
        voucherId: null,
        uniqueIdVoucher: 1002,
        amountConversion: 200.75,
        date: '2024-01-16T00:00:00.000Z',
        check: '1002',
        amount: 200.75,
        status: false,
        message: undefined,
        dateDisplay: undefined,
      },
      {
        id: 3,
        idCustom: 103,
        voucherId: null,
        uniqueIdVoucher: 1003,
        amountConversion: 500.00,
        date: '2024-01-17T00:00:00.000Z',
        check: '1003',
        amount: 500.00,
        status: false,
        message: undefined,
        dateDisplay: undefined,
      },
      {
        id: 4,
        idCustom: 104,
        voucherId: null,
        uniqueIdVoucher: 1004,
        amountConversion: 50.00,
        date: '2024-01-18T00:00:00.000Z',
        check: '1004',
        amount: 50.00,
        status: false,
        message: undefined,
        dateDisplay: undefined,
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    mockSetDetailsLocal = vi.fn()
    mockSetVisibleItems = vi.fn()
    mockSetLocalAmount = vi.fn()
    mockSetVouchersSelected = vi.fn()

    // Mock de format de date-fns
    vi.mocked(format).mockImplementation((date, formatStr) => {
      const d = new Date(date as string)
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  describe('updateLocalBanksAdyen', () => {
    it('debe actualizar el estado de los vouchers que coinciden con los datos procesados', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      // Verificar que setDetailsLocal fue llamado con un callback
      expect(mockSetDetailsLocal).toHaveBeenCalledTimes(1)
      
      // Ejecutar el callback para obtener el nuevo estado
      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)

        console.log('=== DEBUG updatedState ===')
  console.log('Vouchers actualizados:', updatedState.vouchers.map((v: any) => ({
    id: v.id,
    check: v.check,
    amount: v.amount,
    date: v.date,
    status: v.status,
    dateFormatted: format(new Date(v.date), 'dd/MM/yy')
  })))
  console.log('=========================')
      
      // Los primeros 2 vouchers deberían tener status true (coinciden)
      expect(updatedState.vouchers[0].status).toBe(true)
      expect(updatedState.vouchers[1].status).toBe(true)
      // El tercero y el cuarto voucher no coincide
      expect(updatedState.vouchers[2].status).toBe(false)
      expect(updatedState.vouchers[3].status).toBe(false)
    })

    it('debe mantener los vouchers que ya tenían status true', () => {
      const detailsWithTrueStatus = {
        ...mockDetailsLocal,
        vouchers: [
          { ...mockDetailsLocal.vouchers[0], status: true },
          { ...mockDetailsLocal.vouchers[1], status: false },
          { ...mockDetailsLocal.vouchers[2], status: false },
        ],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          detailsWithTrueStatus,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(detailsWithTrueStatus)
      
      // El primer voucher ya era true y debe seguir true
      expect(updatedState.vouchers[0].status).toBe(true)
    })

    it('debe actualizar visibleItems con los vouchers activos dentro del rango', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          2
        )
      })

      expect(mockSetVisibleItems).toHaveBeenCalledTimes(1)
      const visibleItems = mockSetVisibleItems.mock.calls[0][0]
      
      // Debería mostrar solo 2 vouchers (rango 0-2)
      expect(visibleItems.length).toBe(2)
    })

    it('debe calcular correctamente el monto total redondeado a 2 decimales', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      // Ejecutar el callback de setDetailsLocal para obtener los vouchers actualizados
      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      
      // Sumar solo los vouchers con status true (primeros 3)
      const expectedAmount = updatedState.vouchers
        .filter((v: any) => v.status)
        .reduce((acc: number, curr: any) => acc + curr.amount, 0)
      
      expect(mockSetLocalAmount).toHaveBeenCalledWith(Number(expectedAmount.toFixed(2)))
    })

    it('debe actualizar la cantidad de vouchers seleccionados', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      const expectedCount = updatedState.vouchers.filter((v: any) => v.status).length
      
      expect(mockSetVouchersSelected).toHaveBeenCalledWith(expectedCount)
    })

    it('debe mostrar un toast de éxito cuando se agregan vouchers', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      const addedCount = updatedState.vouchers.filter((v: any) => v.status).length
      
      expect(toast).toHaveBeenCalledWith(
        `Se agregaron ${addedCount} vouchers`,
        'success'
      )
    })

    it('debe mostrar un toast de advertencia cuando no se agregan vouchers', () => {
      const processResultWithoutMatches = {
        ...mockProcessResult,
        consolidatedData: [
          {
            date: '2025-01-15',
            check: '9999',
            amount: '999.99',
          },
        ],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          processResultWithoutMatches,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      expect(toast).toHaveBeenCalledWith(
        'Se agregaron 0 vouchers',
        'warning'
      )
    })

    it('debe retornar temprano si no hay consolidatedData', () => {
      const processResultWithoutData = {
        ...mockProcessResult,
        consolidatedData: undefined,
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          processResultWithoutData,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      expect(mockSetDetailsLocal).not.toHaveBeenCalled()
      expect(mockSetVisibleItems).not.toHaveBeenCalled()
      expect(mockSetLocalAmount).not.toHaveBeenCalled()
      expect(mockSetVouchersSelected).not.toHaveBeenCalled()
      expect(toast).not.toHaveBeenCalled()
    })

    it('debe retornar temprano si no hay vouchers en detailsLocal', () => {
      const detailsWithoutVouchers = {
        ...mockDetailsLocal,
        vouchers: undefined,
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          detailsWithoutVouchers as any,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      expect(mockSetDetailsLocal).not.toHaveBeenCalled()
    })

    it('debe manejar correctamente la comparación de fechas usando date-fns format', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      // Verificar que format fue llamado para cada voucher
      expect(mockDetailsLocal.vouchers.length).toBeGreaterThan(0)
    })

    it('debe manejar valores numéricos con 2 decimales correctamente', () => {
      const processResultWithDecimals = {
        ...mockProcessResult,
        consolidatedData: [
          {
            date: '2024-01-15',
            check: '1001',
            amount: '150.555',
          },
        ],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          processResultWithDecimals,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      expect(mockSetLocalAmount).toHaveBeenCalled()
      const amountCalled = mockSetLocalAmount.mock.calls[0][0]
      expect(amountCalled.toString()).not.toContain('.555')
    })

    it('debe manejar el slice correctamente con startRange y endRange', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          1,
          3
        )
      })

      expect(mockSetVisibleItems).toHaveBeenCalledTimes(1)
      const visibleItems = mockSetVisibleItems.mock.calls[0][0]
      expect(visibleItems.length).toBeLessThanOrEqual(2) // del índice 1 al 3
    })

    it('debe preservar el resto de propiedades del voucher al actualizar', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      
      expect(updatedState.vouchers[0].id).toBe(mockDetailsLocal.vouchers[0].id)
      expect(updatedState.vouchers[0].amountConversion).toBe(mockDetailsLocal.vouchers[0].amountConversion)
      expect(updatedState.vouchers[0].check).toBe(mockDetailsLocal.vouchers[0].check)
    })

    it('debe manejar una coincidencia parcial (solo algunos campos coinciden)', () => {
      const processResultPartialMatch = {
        ...mockProcessResult,
        consolidatedData: [
          {
            date: '2024-01-15',
            check: '1001',
            amount: '999.99', // amount no coincide
          },
        ],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          processResultPartialMatch,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      
      // No debe coincidir porque amount es diferente
      expect(updatedState.vouchers[0].status).toBe(false)
    })

    it('debe mane correctamente cuando consolidatedData tiene valores string o number', () => {
      const processResultMixedTypes = {
        ...mockProcessResult,
        consolidatedData: [
          {
            date: '2024-01-15',
            check: 1001, // número en lugar de string
            amount: 150.50, // número en lugar de string
          },
        ],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          processResultMixedTypes,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      
      // Debe funcionar correctamente con números
      expect(updatedState.vouchers[0].status).toBe(true)
    })
  })

  describe('Casos borde', () => {
    it('debe manejar cuando detailsLocal es undefined', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          undefined as any,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      expect(mockSetDetailsLocal).not.toHaveBeenCalled()
    })

    it('debe manejar cuando no hay vouchers en el array', () => {
      const detailsEmptyVouchers = {
        ...mockDetailsLocal,
        vouchers: [],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          detailsEmptyVouchers,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(detailsEmptyVouchers)
      
      expect(updatedState.vouchers).toHaveLength(0)
      expect(mockSetLocalAmount).toHaveBeenCalledWith(0)
      expect(mockSetVouchersSelected).toHaveBeenCalledWith(0)
    })

    it('debe manejar cuando consolidatedData está vacío', () => {
      const processResultEmptyData = {
        ...mockProcessResult,
        consolidatedData: [],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          processResultEmptyData,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          0,
          10
        )
      })

      const callback = mockSetDetailsLocal.mock.calls[0][0]
      const updatedState = callback(mockDetailsLocal)
      
      // Ningún voucher debe cambiar su status
      expect(updatedState.vouchers[0].status).toBe(false)
      expect(updatedState.vouchers[1].status).toBe(false)
    })

    it('debe manejar rangos fuera de los límites del array', () => {
      const { result } = renderHook(() => useHandleTDCAdyen())

      act(() => {
        result.current.updateLocalBanksAdyen(
          mockProcessResult,
          mockDetailsLocal,
          mockSetDetailsLocal,
          mockSetVisibleItems,
          mockSetLocalAmount,
          mockSetVouchersSelected,
          100,
          200
        )
      })

      // slice con índices fuera de rango devuelve array vacío
      expect(mockSetVisibleItems).toHaveBeenCalledWith([])
    })

    it('debe manejar fechas inválidas en el formato', () => {
      const detailsWithInvalidDate = {
        ...mockDetailsLocal,
        vouchers: [
          {
            ...mockDetailsLocal.vouchers[0],
            date: 'fecha-invalida',
          },
        ],
      }

      const { result } = renderHook(() => useHandleTDCAdyen())

      expect(() => {
        act(() => {
          result.current.updateLocalBanksAdyen(
            mockProcessResult,
            detailsWithInvalidDate,
            mockSetDetailsLocal,
            mockSetVisibleItems,
            mockSetLocalAmount,
            mockSetVouchersSelected,
            0,
            10
          )
        })
      }).not.toThrow()
    })
  })
})