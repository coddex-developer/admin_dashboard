import { useEffect, useState } from "react";
import "./styles.min.css";
import Navbar from "../../Navbar";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import MessageError from "../../alerts/MessageError";

export default function NewProduct() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("http://localhost:8080/dashboard/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategories(response.data);
      } catch (error) {
        MessageError(error.response?.data?.message || "Erro ao buscar categorias.");
      }
    }

    fetchCategories();
  }, []);

  async function newCategory(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await axios.post("http://localhost:8080/dashboard/new_category", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      e.target.reset();
      toast.success("Categoria criada com sucesso!", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });

      const updated = await axios.get("http://localhost:8080/dashboard/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(updated.data);
    } catch (error) {
      MessageError(error.response?.data?.message || "Erro ao criar categoria.");
    }
  }

  async function newProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await axios.post("http://localhost:8080/dashboard/new_product", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      e.target.reset();
      toast.success("Produto criado com sucesso!", {
        position: "top-right",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      MessageError(error.response?.data?.message || "Erro ao criar produto.");
    }
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="container-create-product">
        <div className="new-product-container">
          <form onSubmit={newProduct}>
            
            <h1>Novo Produto</h1>
            <select id="categoria" name="categoria" required>
              {categories.map((category) => (
                <option key={category.id} value={category.nome}>
                  {category.nome}
                </option>
              ))}
            </select>
            <input type="url" name="imagem" placeholder="Url da imagem" />
            <input type="text" name="nome" placeholder="Nome do item" />
            <input type="text" name="preco" placeholder="Preço" />
            <input type="text" name="informacao" placeholder="Descrição" />
            <button className="btn-product" type="submit">Adicionar Item</button>
          </form>
        </div>

        <div className="new-category-container">
          <form onSubmit={newCategory}>
            <h1>Nova Categoria</h1>
            <input type="text" name="nome" placeholder="Nome da Categoria" />
            <button className="btn-product" type="submit">Criar Nova Categoria</button>
          </form>
        </div>

      </div >
    </>
  );
}
