import Navbar from "../../Navbar";
import "./styles.min.css";
export default function EditProduct() {
    return (
        <>
            <Navbar />
            
            <div className="containerEditProduct">
                <form>
                    <h1>Atualizar Produto</h1>
                    <label htmlFor="nome">Url da Imagem:</label>
                    <input type="text" name="" id="nome" placeholder="Url da Imagem" />
                    
                    <label htmlFor="titulo">Título:</label>
                    <input type="text" name="titulo" id="titulo" placeholder="Título" />
                    
                    <label htmlFor="preco">Preço:</label>
                    <input type="text" name="preco" id="preco" placeholder="Preço $" />
                    
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea name="descricao" id="descricao" placeholder="Descrição..."></textarea>
                    <button type="submit">Atualizar</button>
                </form>
            </div>
        </>
    );
}
