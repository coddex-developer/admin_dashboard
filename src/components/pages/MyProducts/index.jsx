import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import Swal from "sweetalert2";
import MessageError from "../../alerts/MessageError";
import HandleSearch from "../../Tools/HandleSearch";
import urlServer from "../../../../public/urlServer";
//import "./styles.min.css";

export default function MyProducts() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Função para buscar os produtos
    async function getProducts() {
        try {
            const response = await axios.get(`${urlServer}/dashboard/view_categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProducts(response.data);
            setFiltered(response.data);
        } catch (error) {
            MessageError(error?.response?.data?.message || "Erro ao buscar produtos.");
        }
    }

    // Função para excluir o produto
    async function deleteProduct(idDelete) {
        const confirm = await Swal.fire({
            title: "Você tem certeza?",
            text: "Essa ação não poderá ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {

            try {
                const response = await axios.delete(`${urlServer}/dashboard/view_categories/${id}/${idDelete}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.status === 200) {
                    setProducts(prev => prev.filter(product => product.id !== idDelete));
                    setFiltered(prev => prev.filter(product => product.id !== idDelete));

                    Swal.fire({
                        icon: "success",
                        title: "Produto excluído com sucesso!",
                        showConfirmButton: true,
                        timer: 1500,
                    });
                }
            } catch (error) {
                MessageError(error.response?.data?.message);
            }
        }
    }

    useEffect(() => {
        getProducts();
    }, [id]);

    // Destaque do termo pesquisado
    const highlight = (text) => {
        const term = searchTerm.trim();
        if (!term) return text;

        const regex = new RegExp(`(${term})`, "gi");
        return text.replace(regex, match => `<mark style="background-color:rgb(163, 183, 238); color: white;">${match}</mark>`);
    };


    return (
        <>
            <Navbar />
            <div className="container py-4">
                <HandleSearch
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    setFiltered={setFiltered}
                    allResponse={products}
                />
                <h1 className="text-center mb-4 fw-bold text-primary">Meus Produtos</h1>
                <div className="container-fluid">

                    <table class="w-100 table table-striped table-hover">
                        <thead>
                            <tr className="table-dark">
                                <th scope="col">#Categoria</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Preço</th>
                                <th scope="col">Estoque</th>
                                <th scope="col">Ajustes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (filtered.map((product) => (
                                <tr>
                                    <td>
                                        {product.categoria}
                                    </td>
                                    <td>
                                        {product.nome}
                                    </td>
                                    <td>
                                        {product.preco}
                                    </td>
                                    <td className="text-info">
                                        em breve
                                    </td>
                                    <td className="d-flex gap-1">
                                        <Link to={`/dashboard/view_categories/${id}/${product.id}`}>
                                            <button style={{ width: "30px", height: "30px" }} className="btn d-flex justify-content-center p-0 align-items-center fs-6 btn-primary">
                                                <i class="bi bi-pen"></i>
                                            </button>
                                        </Link>

                                        <button onClick={() => deleteProduct(product.id)} style={{ width: "30px", height: "30px" }} className="btn d-flex justify-content-center p-0 align-items-center fs-6 btn-danger">
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>

                            ))

                            ) : (
                                <div className="col-12 text-center">
                                    <p className="text-muted">Nenhum produto encontrado!</p>
                                </div>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </>
    );
}
