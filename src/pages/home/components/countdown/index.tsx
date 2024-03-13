import { useContext, useEffect } from 'react'
import { ActiveSeparator, CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/cyclesContext'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    markSetAmountSecondsPassed,
  } = useContext(CyclesContext)

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
          markSetAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          markSetAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    markSetAmountSecondsPassed,
  ])

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
