import axios from "axios";
import { Bounce, toast } from "react-toastify";
import Navbar from "../../Navbar";
import { useEffect, useState } from "react";
import { FaSearch, FaTimes, FaTrash, FaEdit, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function MyCategory() {
    const [categories, setCategories] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Função para buscar categorias
    async function getCategories() {
        try {
            const response = await axios.get("http://localhost:8080/dashboard/categories", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setCategories(response.data);
            setFiltered(response.data);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`${message}`, {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    // Função para excluir categorias
    async function deleteCategories(id) {
        const confirm = await Swal.fire({
            title: "Você tem certeza?",
            text: "Essa ação não poderá ser desfeita e todos os produtos vinculados a esta categoria serão excluídos!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar",
        });

        if (confirm.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:8080/dashboard/delete_category/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.status === 200) {
                    setCategories(prev => prev.filter(category => category.id !== id));
                    setFiltered(prev => prev.filter(category => category.id !== id));

                    Swal.fire({
                        title: "Excluído!",
                        text: "A categoria foi excluída com sucesso.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                const message = error.response?.data?.message || error.message;
                toast.error(`${message}`, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "light",
                    transition: Bounce,
                });
            }
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();

        if (term === "") {
            setFiltered(categories);
            return;
        }

        const result = categories.filter(cat => cat.nome.toLowerCase().includes(term));

        if (result.length === 0) {
            toast.warn("Nenhuma categoria encontrada.", {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
                transition: Bounce,
            });
        }

        setFiltered(result);
    };

    const handleClear = () => {
        setSearchTerm("");
        setFiltered(categories);
    };

    // Função que destaca o texto
    const highlight = (text) => {
        const term = searchTerm.trim();
        if (!term) return text;

        const regex = new RegExp(`(${term})`, "gi");
        return text.replace(regex, `<mark style="background-color:rgb(51, 89, 194)">${term}</mark>`);
    };

    return (
        <>
            <Navbar />
            <div className="container py-4">
                <h1 className="text-center mb-4 fw-bold text-primary">Minhas Categorias</h1>

                {/* Barra de pesquisa */}
                <div className="sticky-top bg-white shadow-sm py-3 mb-4" style={{ zIndex: 1020 }}>
                    <div className="row justify-content-center">
                        <div className="col-12 col-8 d-flex flex-md-row gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pesquisar categoria..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2" onClick={handleSearch}>
                                <FaSearch />
                            </button>
                            <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={handleClear}>
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de categorias */}
                <div className="row g-4">
                    {filtered.length > 0 ? (
                        filtered.map((category) => (
                            <div key={category.id} className="col-12 col-sm-6 col-md-4">
                                <div
                                    className="card h-100 shadow-sm border-0 rounded-4"
                                    title={category.descricao || "Categoria sem descrição detalhada"}
                                >
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5
                                            className="card-title text-center fs-5 mb-4"
                                            dangerouslySetInnerHTML={{
                                                __html: highlight(category.nome),
                                            }}
                                        />
                                        <div className="d-grid gap-2">
                                            <Link to={`/dashboard/view_categories/${category.id}/view_products`} className="text-decoration-none btn btn-outline-secondary">
                                                <button className="bg-transparent border-0 gap-2">
                                                    <FaEye className="me-2" />
                                                    Visualizar Produtos
                                                </button>
                                            </Link>
                                            <button className="btn btn-outline-primary">
                                                <FaEdit className="me-2" />
                                                Editar Categoria
                                            </button>
                                            <button
                                                onClick={() => deleteCategories(category.id)}
                                                className="btn btn-outline-danger"
                                                title="Atenção: ao excluir esta categoria, todo o conteúdo vinculado poderá ser perdido."
                                            >
                                                <FaTrash className="me-2" />
                                                Excluir Categoria
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Nenhuma categoria encontrada.</p>
                    )}
                </div>
            </div>
        </>
    );
}
