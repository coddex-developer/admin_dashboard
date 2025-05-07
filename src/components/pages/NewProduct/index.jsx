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
      <h1 className="text-center px-2 mt-4 mb-4 fw-bold text-primary">Cadastro de Categorias e Itens</h1>
      <div className="container-create-product">
        <div className="new-product-container">

          <form className="formNewProduct" onSubmit={newProduct}>

            <h1>Novo Item</h1>
            <label htmlFor="categoria">Categoria:</label>
            <select id="categoria" name="categoria" required>
              {categories.map((category) => (
                <option key={category.id} value={category.nome}>
                  {category.nome}
                </option>
              ))}
            </select>

            <label htmlFor="imagem">Url da imagem:</label>
            <input type="url" id="imagem" name="imagem" placeholder="Url da imagem" />
            
            <label htmlFor="nome">Nome:</label>
            <input type="text" id="nome" name="nome" placeholder="Nome do item" />
            
            <label htmlFor="preco">Preço:</label>
            <input type="text" id="preco" name="preco" placeholder="Preço" />
            
            <label htmlFor="informacao">Descrição:</label>
            <input type="text" name="informacao" placeholder="Descrição" />
            
            <button className="btn-product" type="submit">Adicionar Item</button>
          </form>
        </div>

        <div className="new-category-container">
          <form className="formNewCategory" onSubmit={newCategory}>
            <h1>Nova Categoria</h1>
            <label htmlFor="categoryName">Nome da categoria:</label>
            <input type="text" id="categoryName" name="nome" placeholder="Nome da Categoria" />
            <button className="btn-product" type="submit">Criar Nova Categoria</button>
          </form>
        </div>

      </div >
    </>
  );
}
