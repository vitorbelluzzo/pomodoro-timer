import { useForm } from 'react-hook-form'
import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// variavel para validar os tipos dos inputs
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(1, 'O Ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O Ciclo precisa ser de no máximo 60 minutos'),
})

// ao inves de uma interface, foi utilizado esse infer para gerar os tipos de dados
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function NewCycleForm() {
  const { register, handleSubmit, watch, reset } = useFormorm<NewCycleFormData>({
    resolver: zodResolversolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  return (
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
        min={1}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
