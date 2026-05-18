import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHandleCashData } from '../cashClousing/useHandleCashData'

vi.mock('@context/home/headerContext', () => ({
  useHeaders: vi.fn(),
}))

vi.mock('@context/home/footerClousingContext', () => ({
  useFooter: vi.fn(),
}))

vi.mock('@context/clousing/cashClousingContext', () => ({
  useCashClousing: vi.fn(),
}))

vi.mock('@components/ui/toaster', () => ({
  toaster: {
    create: vi.fn(),
  },
}))

import { useHeaders } from '@context/home/headerContext'
import { useFooter } from '@context/home/footerClousingContext'
import { useCashClousing } from '@context/clousing/cashClousingContext'

describe('useHandleCashData', () => {
  const mockClousingId = 123
  const mockSetData = vi.fn()
  
  let mockUpdateTotal: any
  let mockSetFooterData: any
  let mockSetCashData: any

  const mockDenominations: any = [
    { id: 1, idDenomination: 1, denomination: 100, amount: 5 },
    { id: 2, idDenomination: 2, denomination: 50, amount: 10 },
    { id: 3, idDenomination: 3, denomination: 20, amount: 15 },
  ]

  const mockCashData: any = {
    currencies: [
      {
        id: 1,
        totalFisico: 100,
        totalPOS: 80,
        difference: 20,
        denominations: mockDenominations
      },
      {
        id: 2,
        totalFisico: 200,
        totalPOS: 190,
        difference: 10,
        denominations: mockDenominations
      }
    ],
    tips: 0,
    total: {
      totalPOS: 270,
      totalPhysical: 300,
      difference: 30
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUpdateTotal = vi.fn()
    mockSetFooterData = vi.fn()
    mockSetCashData = vi.fn()

    vi.mocked(useHeaders).mockReturnValue({ updateTotal: mockUpdateTotal } as any)
    vi.mocked(useFooter).mockReturnValue({ setFooterData: mockSetFooterData } as any)
    vi.mocked(useCashClousing).mockReturnValue({ setCashData: mockSetCashData } as any)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('handleInputChange', () => {
    it('debe actualizar correctamente el total físico y la diferencia al cambiar un valor', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '150')
      })

      expect(mockSetData).toHaveBeenCalledTimes(1)
      const updatedData = mockSetData.mock.calls[0][0]
      
      expect(updatedData.currencies[0].totalFisico).toBe(150)
      expect(updatedData.currencies[0].difference).toBe(150 - 80)
      expect(updatedData.total.totalPhysical).toBe(350 - 0)
      expect(updatedData.total.difference).toBe(350 - 270)
    })

    it('debe manejar valores no numéricos correctamente', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, 'abc123xyz')
      })

      const updatedData = mockSetData.mock.calls[0][0]
      expect(updatedData.currencies[0].totalFisico).toBe(123)
    })

    it('NO debe permitir números negativos', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '-50')
      })

      const updatedData = mockSetData.mock.calls[0][0]

      expect(updatedData.currencies[0].totalFisico).toBe(50)
    })

    it('debe actualizar denominaciones cuando se proporcionan', () => {
      const newDenominations: any = [
        { id: 1, idDenomination: 1, denomination: 100, amount: 10 },
        { id: 2, idDenomination: 2, denomination: 50, amount: 20 },
      ]
      
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '150', newDenominations)
      })

      const updatedData = mockSetData.mock.calls[0][0]
      expect(updatedData.currencies[0].denominations).toEqual(newDenominations)
    })

    it('debe mantener las denominaciones existentes cuando no se proporcionan nuevas', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '150')
      })

      const updatedData = mockSetData.mock.calls[0][0]
      expect(updatedData.currencies[0].denominations).toEqual(mockDenominations)
    })

    it('debe manejar correctamente cuando hay tips existentes', () => {
      const cashDataWithTips = {
        ...mockCashData,
        tips: 50
      }

      const { result } = renderHook(() => 
        useHandleCashData(cashDataWithTips, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '200')
      })

      const updatedData = mockSetData.mock.calls[0][0]
      const sumCurrencies = 200 + 200
      const expectedPhysical = sumCurrencies - 50
      
      expect(updatedData.total.totalPhysical).toBe(expectedPhysical)
    })

    it('debe llamar a los contextos con los valores actualizados', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '150')
      })

      const updatedData = mockSetData.mock.calls[0][0]
      
      expect(mockUpdateTotal).toHaveBeenCalledWith(
        updatedData.total.totalPhysical,
        mockClousingId,
        'cash'
      )
      
      expect(mockSetFooterData).toHaveBeenCalledWith(
        updatedData.total,
        mockClousingId,
        'cash'
      )
      
      expect(mockSetCashData).toHaveBeenCalledWith(
        updatedData,
        mockClousingId
      )
    })

    it('debe manejar itemId como string', () => {
      const cashDataWithStringId = {
        ...mockCashData,
        currencies: [
          { ...mockCashData.currencies[0], id: 'item-1' }
        ]
      }

      const { result } = renderHook(() => 
        useHandleCashData(cashDataWithStringId as any, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange('item-1', '150')
      })

      expect(mockSetData).toHaveBeenCalled()
      const updatedData = mockSetData.mock.calls[0][0]
      expect(updatedData.currencies[0].totalFisico).toBe(150)
    })
  })

  describe('handleChangeTips', () => {
    it('debe ignorar el primer llamado (isFirstLoad)', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleChangeTips('100')
      })

      expect(mockSetCashData).not.toHaveBeenCalled()
      expect(mockSetFooterData).not.toHaveBeenCalled()
      expect(mockUpdateTotal).not.toHaveBeenCalled()
      expect(mockSetData).not.toHaveBeenCalled()
    })

    it('debe actualizar correctamente los tips después del primer llamado', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleChangeTips('100')
      })

      act(() => {
        result.current.handleChangeTips('50')
      })

      const sumCurrencies = 100 + 200
      const expectedPhysical = sumCurrencies - 50
      const expectedDifference = expectedPhysical - 270

      expect(mockSetCashData).toHaveBeenCalledTimes(1)
      const updatedCashData = mockSetCashData.mock.calls[0][0]
      
      expect(updatedCashData.tips).toBe(50)
      expect(updatedCashData.total.totalPhysical).toBe(expectedPhysical)
      expect(updatedCashData.total.difference).toBe(expectedDifference)
      
      expect(mockSetFooterData).toHaveBeenCalledWith(
        updatedCashData.total,
        mockClousingId,
        'cash'
      )
      
      expect(mockUpdateTotal).toHaveBeenCalledWith(
        expectedPhysical,
        mockClousingId,
        'cash'
      )
    })

    it('NO debe permitir números negativos en tips', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleChangeTips('-50')
      })

      const updatedCashData = mockSetCashData.mock.calls[0][0]

      expect(updatedCashData.tips).toBe(50)
    })

    it('debe manejar valores no numéricos en tips', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleChangeTips('abc')
      })

      const updatedCashData = mockSetCashData.mock.calls[0][0]
      expect(updatedCashData.tips).toBe(0)
    })

    it('debe actualizar correctamente cuando no hay tips previos', () => {
      const cashDataWithoutTips = {
        ...mockCashData,
        tips: undefined
      }

      const { result } = renderHook(() => 
        useHandleCashData(cashDataWithoutTips as any, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleChangeTips('75')
      })

      const updatedCashData = mockSetCashData.mock.calls[0][0]
      expect(updatedCashData.tips).toBe(75)
    })

    it('debe usar cashRef.current actualizado para cálculos posteriores', () => {
      const { result } = renderHook(
        ({ cashData }) => useHandleCashData(cashData, mockSetData, mockClousingId),
        { initialProps: { cashData: mockCashData } }
      )

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleInputChange(1, '300')
      })

      act(() => {
        result.current.handleChangeTips('100')
      })

      const sumCurrencies = 300 + 200
      const expectedPhysical = sumCurrencies - 100
      
      const updatedCashData = mockSetCashData.mock.calls[1][0]
      expect(updatedCashData.total.totalPhysical).toBe(expectedPhysical)
    })

    it('debe validar que tips no sea undefined', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleChangeTips('')
      })

      const updatedCashData = mockSetCashData.mock.calls[0][0]
      expect(updatedCashData.tips).toBe(0)
    })
  })

  describe('Integración', () => {
    it('debe mantener la consistencia entre múltiples cambios', () => {
      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '150')
      })

      act(() => {
        result.current.handleInputChange(2, '250')
      })

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleChangeTips('75')
      })

      expect(mockSetData).toHaveBeenCalledTimes(2)
      expect(mockSetCashData).toHaveBeenCalledTimes(3)
      expect(mockUpdateTotal).toHaveBeenCalledTimes(3)
    })

    it('debe manejar denominaciones correctamente en el flujo completo', () => {
      const newDenominations: any = [
        { id: 1, idDenomination: 1, denomination: 100, amount: 20 },
        { id: 2, idDenomination: 2, denomination: 50, amount: 30 },
      ]

      const { result } = renderHook(() => 
        useHandleCashData(mockCashData, mockSetData, mockClousingId)
      )

      act(() => {
        result.current.handleInputChange(1, '200', newDenominations)
      })

      act(() => {
        result.current.handleChangeTips('0')
      })

      act(() => {
        result.current.handleChangeTips('50')
      })

      const updatedData = mockSetData.mock.calls[0][0]
      expect(updatedData.currencies[0].denominations).toEqual(newDenominations)
      expect(updatedData.currencies[0].totalFisico).toBe(200)
    })
  })
})