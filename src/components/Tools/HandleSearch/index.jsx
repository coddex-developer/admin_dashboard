import { FaSearch, FaTimes } from "react-icons/fa";
import MessageError from "../../alerts/MessageError";

function HandleSearch({ searchTerm, setSearchTerm, allResponse, setFiltered }) {

     function handleSearch () {
        const term = searchTerm.trim().toLowerCase();

        if (term === "") {
            setFiltered(allResponse);
            return;
        }

        const result = allResponse.filter(cat => cat.nome.toLowerCase().includes(term));
        console.log(result);
        if (result.length === 0) {
            MessageError("Nenhuma categoria encontrada com esse nome.");
        }

        setFiltered(result);
    };

    function handleClear () {
        setSearchTerm("");
        setFiltered(allResponse);
    };

    return (
        <>
            {/* Barra de pesquisa */}
            <div className="sticky-top bg-light px-2  py-1" style={{ zIndex: 1020 }}>
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
                        <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2" onClick={()=> handleSearch()}>
                            <FaSearch />
                        </button>
                        <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2" onClick={()=> handleClear()}>
                            <FaTimes />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HandleSearch;