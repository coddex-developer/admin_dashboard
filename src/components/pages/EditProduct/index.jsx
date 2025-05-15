import axios from "axios";
import Navbar from "../../Navbar";
import "./styles.min.css";
import MessageError from "../../alerts/MessageError";
import { useEffect, useState } from "react";
import urlServer from "../../../../public/urlServer";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditProduct() {
    const { id, idProduct } = useParams();
    const navigate = useNavigate();
    const [editProduct, setEditProduct] = useState({
        imagem: "",
        nome: "",
        preco: "",
        informacao: ""
    });

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await axios.get(`${urlServer}/dashboard/view_categories/${id}/${idProduct}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const productFound = response.data.find(p => p.id === idProduct);
                console.log(productFound);
                setEditProduct(productFound);
            } catch (error) {
                MessageError(error.response?.data?.message || "Erro ao buscar produto.");
            }
        }

        fetchProduct();
    }, [id, idProduct]);

    function handleChange(e) {
        const { id, value } = e.target;
        setEditProduct(prev => ({ ...prev, [id]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.put(`${urlServer}/dashboard/view_categories/${id}/${idProduct}/update`, editProduct, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
           Swal.fire({
                icon: "success",
                title: "Produto atualizado com sucesso!",
                showConfirmButton: false,
                timer: 1500,
            });
            setTimeout(() => {
                 navigate(`/dashboard/view_categories/${id}`);
            }, 2000);

        } catch (error) {
            MessageError(error.response?.data?.message || "Erro ao atualizar o produto.");
        }
    }

    return (
        <>
            <Navbar />
            <div className="containerEditProduct">
                <form onSubmit={handleSubmit}>
                    <h1>Atualizar Produto</h1>

                    <label htmlFor="imagem">Url da Imagem:</label>
                    <input
                        type="text"
                        id="imagem"
                        placeholder="Url da Imagem"
                        value={editProduct.imagem}
                        onChange={handleChange}
                    />

                    <label htmlFor="nome">Título:</label>
                    <input
                        type="text"
                        id="nome"
                        placeholder="Título"
                        value={editProduct.nome}
                        onChange={handleChange}
                    />

                    <label htmlFor="preco">Preço:</label>
                    <input
                        type="text"
                        id="preco"
                        placeholder="Preço $"
                        value={editProduct.preco}
                        onChange={handleChange}
                    />

                    <label htmlFor="informacao">Descrição:</label>
                    <textarea
                        className="textDescription"
                        id="informacao"
                        placeholder="Descrição..."
                        value={editProduct.informacao}
                        onChange={handleChange}
                    ></textarea>

                    <button type="submit">Atualizar</button>
                </form>
            </div>
        </>
    );
}
