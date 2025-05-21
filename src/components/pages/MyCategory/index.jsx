import axios from "axios";
import Navbar from "../../Navbar";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import HandleSearch from "../../Tools/HandleSearch";
import MessageError from "../../alerts/MessageError";
import urlServer from "../../../../public/urlServer";

export default function MyCategory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Buscar categorias no carregamento
    useEffect(() => {
        getCategories();
    }, []);

    async function getCategories() {
        try {
            const response = await axios.get(`${urlServer}/dashboard/categories`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setCategories(response.data);
            setFiltered(response.data);
        } catch (error) {
            MessageError(error.response?.data?.message || "Erro ao buscar categorias.");
        }
    }

    // Excluir categoria com confirmação
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
                const response = await axios.delete(`${urlServer}/dashboard/delete_category/${id}`, {
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
                MessageError(error.response?.data?.message || "Erro ao excluir categoria.");
            }
        }
    }


    // Filtrar categorias com base no termo de pesquisa
    async function editCategory(id) {
        const { value: newName } = await Swal.fire({
            title: "Renomear Categoria",
            input: "text",
            inputValue: categories.find(category => category.id === id)?.nome || "",
            inputLabel: "Novo nome",
            showCancelButton: true,
            confirmButtonText: "Salvar",
            cancelButtonText: "Cancelar",
            preConfirm: (newName) => {
                if (!newName) {
                    Swal.showValidationMessage("Por favor, insira um novo nome.");
                } else {
                    return newName;
                }
            },
        });

        if (newName) {
            try {
                const response = await axios.put(`${urlServer}/dashboard/edit_category/${id}`, { categoria: newName }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.status === 200) {
                    setCategories(prev => prev.map(category => category.id === id ? { ...category, nome: newName } : category));
                    setFiltered(prev => prev.map(category => category.id === id ? { ...category, nome: newName } : category));

                    Swal.fire({
                        title: "Renomeado!",
                        text: "A categoria foi renomeada com sucesso.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: true
                    });
                }
            } catch (error) {
                MessageError(error.response?.data?.message || "Erro ao renomear categoria.");
            }
        }
    }

    // Destaque do termo pesquisado
    const highlight = (text) => {
        const term = searchTerm.trim();
        if (!term) return text;

        const regex = new RegExp(`(${term})`, "gi");
        return text.replace(regex, match => `<mark style="background-color:rgb(178, 193, 233); color: white;">${match}</mark>`);
    };

    return (
        <>
            <Navbar />
            <div className="container py-4">
                {/* Pesquisa */}
                <HandleSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    allResponse={categories}
                    setFiltered={setFiltered}
                />

                <h1 className="text-center mb-4 fw-bold text-primary">Minhas Categorias</h1>

                {/* Lista */}
                <div className="row g-4">
                    {filtered.length > 0 ? (
                        filtered.map((category) => (
                            <div key={category.id} className="col-12 col-sm-6 col-md-4">
                                <div
                                    className="card h-100 shadow-sm border-0 rounded-4"
                                    title={category.descricao || "Categoria sem descrição"}
                                >
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h5
                                            className="card-title text-center fs-5 mb-4"
                                            dangerouslySetInnerHTML={{ __html: highlight(category.nome) }}
                                        />

                                        <div className="d-grid gap-2">
                                            <Link
                                                to={`/dashboard/view_categories/${category.id}`}
                                                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                                            >
                                                <FaEye /> Visualizar Produtos
                                            </Link>

                                            <button className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2" onClick={() => editCategory(category.id)}>
                                                <FaEdit /> Editar Categoria
                                            </button>

                                            <button
                                                onClick={() => deleteCategories(category.id)}
                                                className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                                                title="Atenção: ao excluir esta categoria, todo o conteúdo vinculado poderá ser perdido."
                                            >
                                                <FaTrash /> Excluir Categoria
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
