import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTDC } from '../tdcClousing/useTDC'

// Mocks de los contextos
vi.mock('@context/clousing/tdcClousingContex', () => ({
  useTDCContext: vi.fn(),
}))

vi.mock('@context/home/headerContext', () => ({
  useHeaders: vi.fn(),
}))

import { useTDCContext } from '@context/clousing/tdcClousingContex'
import { useHeaders } from '@context/home/headerContext'

describe('useTDC', () => {
  const mockClousingId = 123
  let mockUpdateTotal: any
  let mockSetTDCData: any
  let mockTDC: any

  // Mock de datos de TDC
  const mockTDCData: any = {
    id: 1,
    employeId: 100,
    total: {
      totalPOS: 5000,
      totalPhysical: 4500,
      difference: -500,
    },
    lines: [
      {
        id: 'bank-1',
        idBank: 1,
        bank: 'Banco Santander',
        physical: 1500,
        pos: 2000,
        voucherAmount: 500,
        voucherAmountDisplay: 500,
        vouchers: [],
        isRoleEditable: true,
      },
      {
        id: 'bank-2',
        idBank: 2,
        bank: 'Banco BBVA',
        physical: 2000,
        pos: 2500,
        voucherAmount: 500,
        voucherAmountDisplay: 500,
        vouchers: [],
        isRoleEditable: true,
      },
      {
        id: 'bank-3',
        idBank: 3,
        bank: 'Banco Citibanamex',
        physical: 1000,
        pos: 500,
        voucherAmount: -500,
        voucherAmountDisplay: -500,
        vouchers: [],
        isRoleEditable: true,
      },
    ],
    linesCopy: [],
    isRoleEditable: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUpdateTotal = vi.fn()
    mockSetTDCData = vi.fn()
    mockTDC = {
      [mockClousingId]: mockTDCData,
    }

    vi.mocked(useHeaders).mockReturnValue({ updateTotal: mockUpdateTotal } as any)
    vi.mocked(useTDCContext).mockReturnValue({ 
      tdc: mockTDC, 
      setTDCData: mockSetTDCData 
    } as any)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('updatedPhysicalAmount', () => {
    it('debe actualizar el monto físico de una línea específica', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      expect(mockSetTDCData).toHaveBeenCalledTimes(1)
      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      
      expect(updateTDCData.lines[0].physical).toBe(2500)
      expect(updateTDCData.lines[0].id).toBe('bank-1')
    })

    it('debe mantener los valores de las otras líneas sin cambios', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      
      expect(updateTDCData.lines[1].physical).toBe(2000)
      expect(updateTDCData.lines[2].physical).toBe(1000)
    })

    it('debe recalcular correctamente el total físico sumando todas las líneas', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      const expectedTotalPhysical = 2500 + 2000 + 1000
      
      expect(updateTDCData.total.totalPhysical).toBe(expectedTotalPhysical)
    })

    it('debe actualizar el contexto updateTotal con el nuevo total físico', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const expectedTotalPhysical = 2500 + 2000 + 1000
      expect(mockUpdateTotal).toHaveBeenCalledWith(
        expectedTotalPhysical,
        mockClousingId,
        'TDC'
      )
    })

    it('debe manejar correctamente valores con comas y puntos decimales', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2,500.75')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[0].physical).toBe(2500.75)
    })

    it('debe redondear valores a 2 decimales', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500.555')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[0].physical).toBe(2500.56)
    })

    it('no debe permitir valores negativos', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '-500')
      })

      // Si la validación funciona correctamente, no debería actualizar
      // Verificamos que el valor original se mantiene
      const updateTDCData = mockSetTDCData.mock.calls[0]?.[0]
      if (updateTDCData) {
        expect(updateTDCData.lines[0].physical).toBe(1500)
      }
    })

    it('debe ignorar valores no numéricos', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', 'abc')
      })

      // Verificamos que el valor original se mantiene
      const updateTDCData = mockSetTDCData.mock.calls[0]?.[0]
      if (updateTDCData) {
        expect(updateTDCData.lines[0].physical).toBe(1500)
      }
    })

    it('debe ignorar strings vacíos', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0]?.[0]
      if (updateTDCData) {
        expect(updateTDCData.lines[0].physical).toBe(1500)
      }
    })

    it('debe aceptar el valor 0 como válido', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '0')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[0].physical).toBe(0)
    })

    it('debe manejar el índice como número', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount(1, '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[0].physical).toBe(2500)
    })

    it('debe manejar el índice como string', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-2', '3500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[1].physical).toBe(3500)
    })

    it('debe retornar 0 como total físico si no hay líneas', () => {
      const emptyTDCData = {
        ...mockTDCData,
        lines: [],
      }

      vi.mocked(useTDCContext).mockReturnValue({ 
        tdc: { [mockClousingId]: emptyTDCData }, 
        setTDCData: mockSetTDCData 
      } as any)

      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.total.totalPhysical).toBe(0)
    })

    it('debe manejar correctamente cuando tdc o tdc[clousingId] es undefined', () => {
      vi.mocked(useTDCContext).mockReturnValue({ 
        tdc: undefined, 
        setTDCData: mockSetTDCData 
      } as any)

      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      // No debe llamar a setTDCData ni a updateTotal
      expect(mockSetTDCData).not.toHaveBeenCalled()
      expect(mockUpdateTotal).not.toHaveBeenCalled()
    })

    it('debe preservar todas las propiedades del objeto al actualizar', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      
      expect(updateTDCData.id).toBe(mockTDCData.id)
      expect(updateTDCData.employeId).toBe(mockTDCData.employeId)
      expect(updateTDCData.linesCopy).toBe(mockTDCData.linesCopy)
      expect(updateTDCData.isRoleEditable).toBe(mockTDCData.isRoleEditable)
    })

    it('debe manejar valores con muchos decimales correctamente', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500.123456789')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[0].physical).toBe(2500.12)
    })

    it('debe manejar múltiples actualizaciones en secuencia', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
        result.current.updatedPhysicalAmount('bank-2', '3500')
        result.current.updatedPhysicalAmount('bank-3', '1500')
      })

      expect(mockSetTDCData).toHaveBeenCalledTimes(3)
      expect(mockUpdateTotal).toHaveBeenCalledTimes(3)

      // Verificar la última actualización
      const lastCall = mockSetTDCData.mock.calls[2][0]
      const expectedTotalPhysical = 2500 + 3500 + 1500
      expect(lastCall.total.totalPhysical).toBe(expectedTotalPhysical)
    })

    it('debe manejar valores negativos en el total físico cuando corresponde', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '-500')
      })

      // Como no debe permitir negativos, el total no debería cambiar
      const updateTDCData = mockSetTDCData.mock.calls[0]?.[0]
      if (updateTDCData) {
        const expectedTotalPhysical = 1500 + 2000 + 1000
        expect(updateTDCData.total.totalPhysical).toBe(expectedTotalPhysical)
      }
    })

    it('debe manejar correctamente la línea con id que no existe', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-nonexistent', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      // Todas las líneas deben mantener sus valores originales
      expect(updateTDCData.lines[0].physical).toBe(1500)
      expect(updateTDCData.lines[1].physical).toBe(2000)
      expect(updateTDCData.lines[2].physical).toBe(1000)
      
      // El total debe recalcularse con los valores originales
      const expectedTotalPhysical = 1500 + 2000 + 1000
      expect(updateTDCData.total.totalPhysical).toBe(expectedTotalPhysical)
    })
  })

  describe('Casos borde', () => {
    it('debe funcionar correctamente cuando linesCopy está ausente', () => {
      const tdcDataWithoutCopy = {
        ...mockTDCData,
        linesCopy: undefined,
      }

      vi.mocked(useTDCContext).mockReturnValue({ 
        tdc: { [mockClousingId]: tdcDataWithoutCopy }, 
        setTDCData: mockSetTDCData 
      } as any)

      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      expect(updateTDCData.lines[0].physical).toBe(2500)
      expect(updateTDCData.linesCopy).toBeUndefined()
    })

    it('debe mantener la estructura completa del objeto Total', () => {
      const { result } = renderHook(() => useTDC(mockClousingId))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      const updateTDCData = mockSetTDCData.mock.calls[0][0]
      
      expect(updateTDCData.total).toHaveProperty('totalPhysical')
      expect(updateTDCData.total).toHaveProperty('totalPOS')
      expect(updateTDCData.total).toHaveProperty('difference')
    })

    it('debe manejar clousingId que no existe en el objeto tdc', () => {
      vi.mocked(useTDCContext).mockReturnValue({ 
        tdc: { 999: mockTDCData }, 
        setTDCData: mockSetTDCData 
      } as any)

      const { result } = renderHook(() => useTDC(456))

      act(() => {
        result.current.updatedPhysicalAmount('bank-1', '2500')
      })

      expect(mockSetTDCData).not.toHaveBeenCalled()
      expect(mockUpdateTotal).not.toHaveBeenCalled()
    })
  })
})