import '../index.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '../components/ui/input'
import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

const FormSchema = z.object({
  users: z.string({
      required_error: "Selecione uma atendente",
    }),
  password: z.string({
    required_error: "Insira a senha",
  })
    .min(2, 'A senha deve conter mais de dois caracteres')
})

export function Login() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    getUsers()
  }, [])

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  })

  function onSubmit(data) {
    localStorage.setItem('username', data.users)
    navigate('/Sales')
  }

  async function getUsers() {
    const response = await fetch('http://localhost:3000/api/funcionarios',{
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
  
    const data = await response.json();
    setUsers(data.results)
    console.log(data.results)
  }

  return (
    <main className='h-screen flex items-center justify-center bg-zinc-50'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-[260px]">
          <FormField
            control={form.control}
            name="users"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário(a)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o(a) usuário(a)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.name.toString()}>
                          {(user.name).toUpperCase()}                                              
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Senha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="bg-purple-500 hover:bg-purple-600" type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  )
}

export default Login;
