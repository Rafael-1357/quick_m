import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'

export function PreSale() {

  const navigate = useNavigate()
  const [user, setUser] = useState('');

  useEffect(() => {
    localStorage.getItem('user') ? setUser(JSON.parse(localStorage.getItem('user'))) : navigate('/')
  }, []);

  function onSale() {
    navigate('/sales')
  }
  
  function exit(){
    localStorage.removeItem('user');
    navigate('/')
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center antialiased bg-zinc-50">
      <header className="font-bold text-lg mb-3">
        Olá, <span className="capitalize font-normal text-purple-500">{user.name}</span>. Como vai?
      </header>
      <main className="w-full flex flex-col items-center gap-2">
        <Button onClick={onSale} className="bg-purple-500 text-base text-center w-3/5 p-6" >Nova venda<ArrowRight className="ml-2" /></Button>
        {
          user.role === 'admin'
          ? <Button className="bg-purple-500 text-base text-center w-3/5 p-6" >Dashboard<ArrowRight className="ml-2" /></Button>
          : null
        }
        <a className="text-purple-500 underline" onClick={exit}>Sair</a>
      </main>
    </div>
  )
}