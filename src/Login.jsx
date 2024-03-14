import './index.css'
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
import { Input } from './components/ui/input'
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

const FormSchema = z.object({
  user: z.string({
    required_error: "Selecione um(a) usuário(a)",
  }),
  password: z.string({
    required_error: "Insira a senha",
  })
    .min(2, 'A senha deve conter mais de dois caracteres')
});

export function Login() {

  const [users, setUsers] = useState([]);
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    getUsers()
  }, [])

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
    },
  })

  async function onSubmit(data) {
    const response = await fetch('http://129.151.108.167:3000/api/users/auth', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const dataResponse = await response.json();

    if(dataResponse.error != '') {
      toast({
        variant: "destructive",
        title: "Opss... Falha ao tentar entrar!",
        description: "Verifique se sua senha está correta.",
      })
      return
    }

    localStorage.setItem('user', JSON.stringify(dataResponse.results[0]))
    toast({
      variant: "success",
      title: "Sucesso",
      description: "Você entrou em sua conta!",
    })
    navigate('/PreSale')
  }

  async function getUsers() {
    const response = await fetch('http://129.151.108.167:3000/api/users', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();
    setUsers(data.results)
  }

  return (
    <main className='h-screen flex items-center justify-center bg-zinc-50'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-[260px]">
          <FormField
            control={form.control}
            name="user"
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
          <Button className="bg-purple-500 hover:bg-purple-600" type="submit">Entrar</Button>
        </form>
      </Form>
    </main>
  )
}

export default Login;
