import { useEffect, useState } from 'react'
import { ActiveSeparator, CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'

export function Countdown() {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) // Variavel para armazenar a quantidade de segundos passada

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // variavel para caso o ciclo estiver ativo ele multiplica os minutos do ciclo por 60, se nao, ele é 0

  useEffect(() => {
    let interval: number
    // toda alteração que a variavel "activeCycle" mudar, esse useffect ira ser acionado
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          setcycles((state) =>
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])



  return (
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
  )
}
