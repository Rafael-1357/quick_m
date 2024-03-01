import { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";



export function Sales() {

  const [products, setProducts] = useState([]);
  const { handleSubmit } = useForm()

  useEffect(() => {
    getProducts()
  }, []);

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

  function modifyQuantity(productId, action) {

    if (action === 'add') {
      setProducts((prevState) =>
        prevState.map((objeto) =>
          objeto.id === productId ? { ...objeto, qtd: objeto.qtd + 1 } : objeto
        )
      );
    } else if (action === 'remove') {
      setProducts((prevState) =>
        prevState.map((objeto) =>
          objeto.id === productId ? { ...objeto, qtd: objeto.qtd - 1 } : objeto
        )
      );
    }
  }

  async function createOrder() {

    const user = JSON.parse(localStorage.getItem('user'))
    const order = products.filter(product => {
      if (product.qtd > 0) {
        return product
      }
    })
    const productsNames = order.map(product => {
      return product.productname;
    })
    console.log(productsNames)
    let totalSale = 0;
    order.map(product => {
      const value = parseFloat(product.productvalue);
      const qtd = parseInt(product.qtd)
      const totalValue = qtd * value;
      return totalSale += totalValue;
    })
    const datasale = new Date()

    const dataJSON = JSON.stringify({
      users_iduser: user.id,
      products: productsNames,
      totalsale: totalSale.toString(),
      datesale: datasale
    })

    const response = await fetch('http://localhost:3000/api/sale', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: dataJSON
    });

    const data = await response.json();
    const dataResults = data.results

    // console.log(dataResults)
  }

  return (
    <main className="w-full h-screen flex flex-col gap-4">
      <header className="w-full flex justify-end">
        <h1 className="p-2 m-2 rounded uppercase border-2 border-zinc-400">
          {localStorage.getItem('username')}
        </h1>
      </header>
      <form onSubmit={handleSubmit(createOrder)} className="w-full h-full p-2 flex flex-col justify-between">
        <div className="w-full flex gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="w-1/2 bg-zinc-100 shadow-md h-fit flex-wrap rounded border-2 p-2 border-zinc-100"
            >
              <h1 className="text-lg font-bold">{(product.productname).toUpperCase()}</h1>
              <p>R$ {product.productvalue}</p>
              <div className="flex gap-1 justify-between">
                <Button
                  type='button'
                  onClick={() => modifyQuantity(product.id, 'add')}
                  className="bg-purple-500 hover:bg-purple-600">
                  <Plus />
                </Button>
                <Input
                  name={product.productname}
                  readOnly
                  type='Number'
                  value={product.qtd}
                  className="text-center text-lg m-0 border-zinc-400"
                />
                <Button
                  type='button'
                  onClick={() => modifyQuantity(product.id, 'remove')}
                  className="bg-purple-500 hover:bg-purple-600">
                  <Minus />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="w-full text-white font-bold text-2xl p-4 rounded-lg bg-purple-500">
          Enviar
        </button>
      </form>
    </main>
  )
}