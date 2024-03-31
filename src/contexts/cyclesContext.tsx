import { ReactNode, createContext, useReducer, useState } from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  InterruptCurrentCycleAction,
  markedCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

interface CreateCycleData {
  task: string
  minutesAmount: number
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,

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
    dispatch(markedCurrentCycleAsFinishedAction())
  }
  function InterruptCurrentCycle() {
    dispatch(InterruptCurrentCycleAction())
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
    dispatch(addNewCycleAction(newCycle))
    // setcycles((state) => [...state, newCycle]) // adiciona todos os ciclos ja criados e adiciona um novo ciclo

    setAmountSecondsPassed(0) // seta a quantidade de numeros ja passados pra zero
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
