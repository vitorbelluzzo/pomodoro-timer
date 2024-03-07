import { Pause, Play } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  ActiveSeparator,
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

// variavel para validar os tipos dos inputs
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O Ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O Ciclo precisa ser de no máximo 60 minutos'),
})

// ao inves de uma interface, foi utilizado esse infer para gerar os tipos de dados
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
}

export function Home() {
  const [cycles, setcycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // variavel para setar o ciclo ativo ou inativo, ele inicia como nulo
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // Variavel para armazenar a quantidade de segundos passada

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // variavel para checkar se na lista de cycles existe algum ciclo ativo atraves do id

  useEffect(() => {
    let interval: number
    // toda alteração que a variavel "activeCycle" mudar, esse useffect ira ser acionado
    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  // ao clicar em submit, ele chamara a função abaixo que entende os tipos de dados vindos do NewCycleFormData
  function handleCreateNewCycle(data: NewCycleFormData) {
    // é criado uma variavel chamado "newCycle", que utiliza a interface "Cycle" para saber os tipos dos dados
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // id é gerado atraves do milisegundo da hora
      task: data.task, // esse data vem do NewCycleFormData
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    setActiveCycleId(newCycle.id) // aqui estou setando como ciclo ativo
    setcycles((state) => [...state, newCycle]) // adiciona todos os ciclos ja criados e adiciona um novo ciclo
    setAmountSecondsPassed(0) // seta a quantidade de numeros ja passados pra zero
    reset() // reseta os inputs
  }

  function handleInterruptCycle() {
    setcycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // variavel para caso o ciclo estiver ativo ele multiplica os minutos do ciclo por 60, se nao, ele é 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // variavel para caso o ciclo estiver ativo, ele subtrai o total de segundos menos a quantidade de segundos passada, se nao, ele é 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    // esse useEffect serve para quando o ciclo estiver ativo, o titulo da pagina ter um contador tambem
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [activeCycle, minutes, seconds])

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-sugestion"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-sugestion">
            <option value="projeto 1" />
            <option value="projeto 2" />
            <option value="projeto 3" />
          </datalist>

          <label htmlFor="">durante</label>
          <MinutesAmountInput
            type="number"
            disabled={!!activeCycle}
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          {activeCycle ? (
            <ActiveSeparator>:</ActiveSeparator>
          ) : (
            <Separator>:</Separator>
          )}
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <Pause size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
