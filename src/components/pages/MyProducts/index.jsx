import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import Swal from "sweetalert2";
import MessageError from "../../alerts/MessageError";

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
                }
            } catch (error) {
                MessageError(error.response?.data?.message);
            }
        }
    }

    useEffect(() => {
        getProducts();
    }, [id]);
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
                                        <button onClick={() => deleteProduct(product.id)} className="btn btn-danger">Excluir</button>
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
