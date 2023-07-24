import './styles.css'
import { IconContext } from "react-icons";
import {FaTrashCan} from "react-icons/fa6";

export function Favorites(props){

    return (
                    <li>
                    <img src={props.image} alt="Cartaz do filme" />
                    <strong>{props.title}</strong>
                    <IconContext.Provider value={{className: "trash-button" }}>
                    <button onClick={props.removeFavorite}><FaTrashCan /></button>
                    </IconContext.Provider>
                    </li>
    )
}