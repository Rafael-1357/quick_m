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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"


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
  const [paymentChange, setPaymentChange] = useState(0)
  const [paymentMethodSelected, setPaymentMethodSelected] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([])
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
          productId === product.id ? { ...product, qtd: product.qtd + 1 } : product
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

  function onSubmit(data) {
    console.log(data)
  }

  return (
    <main className="w-full h-screen flex flex-col bg-zinc-50">
      <header className="w-full p-3 flex justify-start ">
        <Button
          onClick={() => { navigate('/PreSale') }}
          className="bg-purple-500">
          <ArrowLeft className="mr-2" /> Voltar
        </Button>
      </header>
      <div className="w-full p-3 pt-0 grid grid-cols-2 gap-3 overflow-y-auto">
        {products.map(product => (
          <div key={product.id}>
            <h1
              className="text-lg font-bold truncate">
              {(product.productname).toUpperCase()}
            </h1>
            <span>{
              new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                product.productvalue,
              )
            }</span>
            <div className="flex gap-3">
              <Button className="bg-purple-500" onClick={() => modifyQuantity(product.id, 'add')}><Plus /></Button>
              <Input className='focus-visible:ring-0 text-center text-lg' value={product.qtd} readOnly></Input>
              <Button className="bg-purple-500" onClick={() => modifyQuantity(product.id, 'remove')}><Minus /></Button>
            </div>
          </div>
        ))}
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button onClick={() => setSelectedProducts(checkSelectedProducts())} className="text-xl m-3 p-6 bg-purple-500">Verificar</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="max-h-96 overflow-auto">
              {
                selectedProducts.map(product => (
                  product.qtd != 0 &&
                  <div key={product.id} className="text-left">
                    <DrawerTitle>{product.productname}</DrawerTitle>
                    <DrawerDescription>
                      {
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                          product.productvalue,
                      )}
                      | Quantidade: {product.qtd}</DrawerDescription>
                    <Separator className="my-4" />
                  </div>
                ))
              }
            </DrawerHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de pagamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-0">
                            <SelectValue placeholder="Método de pagamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PIX">Pix</SelectItem>
                          <SelectItem value="CREDITO">Crédito</SelectItem>
                          <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('payment_method') === 'DINHEIRO'
                  ?
                  <div>
                    <Label>Valor da(s) notas(s)</Label>
                    <Input
                      className="focus:ring-0"
                      placeholder='R$ 0'
                      onChange={e => {
                        setPaymentChange(e.target.value)
                      }}
                      onValueChange={(value) => console.log(value)}
                    // value={paymentChange}
                    // value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    //   parseInt(paymentChange),)}
                    />
                  </div>
                  : null
                }
                <pre>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  parseInt(paymentChange),)}</pre>
                <Button type="submit">Submit</Button>
              </form>
            </Form>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  )
}