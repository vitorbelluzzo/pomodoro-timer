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

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, dispatch] = useReducer((state: Cycle[], action: unknown) => {
    console.log(state)
    console.log(action)

    if (action.type === 'ADD_NEW_CYCLE') {
      return [...state, action.payload.newCycle]
    }

    return state
  }, [])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // variavel para setar o ciclo ativo ou inativo, ele inicia como nulo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // Variavel para armazenar a quantidade de segundos passada
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // variavel para checkar se na lista de cycles existe algum ciclo ativo atraves do id

  // criar uma nova função chamada markCycleAsFinished e copio o setcycle que esta no arquivo countdown e jogo dentro dessa função
  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
    // setcycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
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
    setActiveCycleId(newCycle.id) // aqui estou setando como ciclo ativo
    setAmountSecondsPassed(0) // seta a quantidade de numeros ja passados pra zero
  }

  function InterruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    // setcycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
    setActiveCycleId(null)
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
