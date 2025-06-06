import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import Swal from "sweetalert2";
import MessageError from "../../alerts/MessageError";
import HandleSearch from "../../Tools/HandleSearch";
import urlServer from "../../../../public/urlServer";
import "./styles.min.css";

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
                <div className="containerCards">
                    {filtered.length > 0 ? (filtered.map((product) => (
                        <div className="cardsProducts" key={product.id}>
                            <div className="card">
                                <img src={product.imagem} className="card-img-top" alt={product.nome} />
                                <div className="card-body">
                                    <h5
                                        className="card-title text-center fs-5 mb-4"
                                        dangerouslySetInnerHTML={{ __html: highlight(product.nome) }}
                                    />
                                    <p className="card-text">R$ {product.preco}</p>
                                    <p className="card-text">Categoria: {product.categoria}</p>
                                    <p className="card-text">{product.informacao}</p>
                                    <div className="containerBtn">
                                        <Link to={`/dashboard/view_categories/${id}/${product.id}`}>
                                            <button className="btn btn-primary">Editar</button>
                                        </Link>
                                        <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Excluir</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">Nenhum produto encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
