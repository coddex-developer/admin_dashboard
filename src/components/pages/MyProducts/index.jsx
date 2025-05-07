import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import Swal from "sweetalert2";
import MessageError from "../../alerts/MessageError";
import HandleSearch from "../../Tools/HandleSearch";

export default function MyProducts() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    async function getProducts() {
        try {
            const response = await axios.get(`http://localhost:8080/dashboard/view_categories/${id}/view_products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProducts(response.data);
            setFiltered(response.data);
        } catch (error) {
            alert(error?.response?.data?.message || "Erro ao buscar produtos.");
        }
    }

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
                const response = await axios.delete(`http://localhost:8080/dashboard/view_categories/${id}/view_products/${idDelete}`, {
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
                <div className="row">
                    {filtered.length > 0 ? (filtered.map((product) => (
                        <div className="col-md-4 mb-3" key={product.id}>
                            <div className="card">
                                <img src={product.imagem} className="card-img-top" alt={product.nome} />
                                <div className="card-body">
                                    <h5
                                        className="card-title text-center fs-5 mb-4"
                                        dangerouslySetInnerHTML={{ __html: highlight(product.nome) }}
                                    />
                                    <p className="card-text">Preço: R$ {product.preco}</p>
                                    <p className="card-text">Descrição: {product.informacao}</p>
                                    <div className="containerBtn">
                                        <button className="btn btn-primary me-2">Editar</button>
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
