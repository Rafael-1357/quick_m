import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"
import { useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
  payment_method: z.string({
    required_error: "Selecione um(a) usuário(a)",
  }),
});


export function Sales() {

  const [products, setProducts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState([]);
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    getProducts()
    getPaymentMethods()
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
  })

  async function getProducts() {
    const response = await fetch('http://localhost:3000/api/products', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();
    const dataResults = data.results
    dataResults.map(product => {
      product['qtd'] = 0
    })
    setProducts(dataResults)
  }

  async function getPaymentMethods() {
    const response = await fetch('http://localhost:3000/api/payment', {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await response.json();
    const dataResults = data.results
    setPaymentMethods(dataResults)
  }

  function modifyQuantity(productId, action) {

    if (action === 'add') {
      setProducts((product) =>
        product.map((product) =>
          product.id === productId ? { ...product, qtd: product.qtd + 1 } : product
        )
      );
    } else if (action === 'remove') {
      setProducts((product) =>
        product.map((product) =>
          product.id === productId && product.qtd > 0 ? { ...product, qtd: product.qtd - 1 } : product
        )
      );
    }
  }

  function checkSelectedProducts() {
    return products.filter(product => {
      if (product.qtd > 0) {
        return product
      }
    })
  }

  function checkTotalValue() {
    let totalPurchase = 0;
    checkSelectedProducts().map(product => {
      const value = parseFloat(product.productvalue);
      const qtd = parseInt(product.qtd)
      const totalValue = qtd * value;
      return totalPurchase += totalValue;
    })
    return totalPurchase
  }

  async function createOrder(data) {
    const user = JSON.parse(localStorage.getItem('user'))

    let totalPurchase = checkTotalValue();

    const datasale = new Date()


    const dataJSON = JSON.stringify({
      users_iduser: user.id,
      products: products,
      totalsale: totalPurchase.toString(),
      datesale: datasale,
      payment_methods: data.payment_method
    })

    console.log(paymentMethodSelected)

    const response = await fetch('http://localhost:3000/api/sale', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: dataJSON
    });

    if (response.status === 200) {
      toast({
        variant: "success",
        title: "Sucesso",
        description: "Venda feita com sucesso!",
      })
      navigate('/PreSale')
      return
    }
    toast({
      variant: "destructive",
      title: "Opss... Falha ao enviar venda!",
      description: "Verifique sua conexão com a internet.",
    })
  }

  return (
    <main className="w-full h-screen flex flex-col bg-zinc-50">
      <header className="w-full flex justify-start ">
        <Button onClick={() => { navigate('/PreSale') }} className="bg-purple-500 m-1 pl-3"><ArrowLeft className="mr-2" /> Voltar</Button>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createOrder)} className="w-full flex flex-col gap-3 overflow-y-auto p-2">
          <div className="w-full grid grid-cols-2 gap-3 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full bg-zinc-100 shadow-md h-fit flex-wrap rounded border-2 p-2 border-zinc-100"
              >
                <h1 className="text-lg font-bold truncate">{(product.productname).toUpperCase()}</h1>
                <p>
                  {
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      product.productvalue,
                    )
                  }
                </p>
                <div className="flex gap-1 justify-between">
                  <Button
                    type='button'
                    onClick={() => modifyQuantity(product.id, 'add')}
                    className="bg-purple-500 hover:bg-purple-600 p-4">
                    <Plus />
                  </Button>
                  <Input
                    name={product.productvalue}
                    readOnly
                    type='Number'
                    value={product.qtd}
                    className="text-center text-lg m-0 border-zinc-400 p-0"
                  />
                  <Button
                    type='button'
                    onClick={() => modifyQuantity(product.id, 'remove')}
                    className="bg-purple-500 hover:bg-purple-600 p-4">
                    <Minus />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Drawer>
            <DrawerTrigger>
              <button
                type="button"
                className="w-full text-white font-bold text-2xl p-4 rounded-lg bg-purple-500">
                Conferir
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="max-h-96 overflow-auto">
                {
                  products.map(product => (
                    product.qtd != 0 &&
                    <div className="text-left">
                      <DrawerTitle>{product.productname}</DrawerTitle>
                      <DrawerDescription>
                        R$ {
                          new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            product.productvalue,
                          )}
                        | Quantidade: {product.qtd}</DrawerDescription>
                      <Separator className="my-4" />
                    </div>
                  ))
                }
              </DrawerHeader>
              <DrawerFooter>
                <div className="mb-2">
                  <DrawerTitle>Valor total</DrawerTitle>
                  <DrawerDescription>
                    {
                      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        checkTotalValue(),
                      )
                    }
                  </DrawerDescription>
                </div>
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de pagamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} onChange={setPaymentMethodSelected(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um método" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.id} value={method.method}>
                              {(method.method).toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {
                  setPaymentMethodSelected == "Dinheiro" ? console.log('foi')
                    : null                }
                <Button
                  onClick={() => {
                    const button = document.getElementById('submit');
                    button.click();
                  }}
                  className="w-full text-white font-bold text-2xl p-4 rounded-lg bg-purple-500 mt-2">
                  Finalizar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          <button className="hidden" id="submit" type="submit" />
        </form>
      </Form>
    </main>
  )
}