import { useContext, useEffect, useState } from 'react'
import { ActiveSeparator, CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../..'

export function Countdown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext)
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
          markCurrentCycleAsFinished()
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
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

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
