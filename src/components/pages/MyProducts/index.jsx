import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar";

export default function MyProducts() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    async function getProducts() {
        try {
            const response = await axios.get(`http://localhost:8080/dashboard/view_categories/${id}/view_products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setProducts(response.data);
        } catch (error) {
            alert(error?.response?.data?.message || "Erro ao buscar produtos.");
        }
    }

    useEffect(() => {
        getProducts();
    }, [id]);
    console.log(products.toLocaleString());
    return (
        <>
        <Navbar />
            <div className="container py-4">
                <h1 className="mb-3">Meus Produtos</h1>
                <p className="text-muted mb-4">Esta página está em construção.</p>
                <div className="row">
                    {products.map((product) => (
                        <div className="col-md-4 mb-3" key={product.id}>
                            <div className="card">
                                <img src={product.imagem} className="card-img-top" alt={product.nome} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.nome}</h5>
                                    <p className="card-text">Preço: R$ {product.preco}</p>
                                    <p className="card-text">Descrição: {product.informacao}</p>
                                    <div className="containerBtn">
                                        <button className="btn btn-primary me-2">Editar</button>
                                        <button className="btn btn-danger">Excluir</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
