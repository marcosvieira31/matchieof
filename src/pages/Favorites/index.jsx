import './styles.css'
import {FaTrashCan} from "react-icons/fa6";

export function Favorites(props){
    return (
                <li>
                    <img src={props.image} alt="Cartaz do filme" />
                    <strong>{props.title}</strong>
                    <button><FaTrashCan /></button>
                </li>
    )
}