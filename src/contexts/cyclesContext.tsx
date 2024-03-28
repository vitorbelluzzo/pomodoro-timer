import { ReactNode, createContext, useReducer, useState } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  markSetAmountSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  InterruptCurrentCycle: () => void
}
interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        default:
          return state
      }
    },
    {
      cycles: [],
      activeCycleId: null,
    },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // Variavel para armazenar a quantidade de segundos passada
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // variavel para checkar se na lista de cycles existe algum ciclo ativo atraves do id

  // criar uma nova função chamada markCycleAsFinished e copio o setcycle que esta no arquivo countdown e jogo dentro dessa função
  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
  }

  function markSetAmountSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  // ao clicar em submit, ele chamara a função abaixo que entende os tipos de dados vindos do NewCycleFormData
  function createNewCycle(data: CreateCycleData) {
    // é criado uma variavel chamado "newCycle", que utiliza a interface "Cycle" para saber os tipos dos dados
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // id é gerado atraves do milisegundo da hora
      task: data.task, // esse data vem do NewCycleFormData
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
    // setcycles((state) => [...state, newCycle]) // adiciona todos os ciclos ja criados e adiciona um novo ciclo

    setAmountSecondsPassed(0) // seta a quantidade de numeros ja passados pra zero
  }

  function InterruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        markSetAmountSecondsPassed,
        createNewCycle,
        InterruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
