import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"
import './actorsModal.css';

export default function ActorsModal({ children, open, onClose }) {

    const dialogActors = useRef();

    useEffect(() => {
        const modal = dialogActors.current;
        if (open) {
            dialogActors.current.showModal();
        }

        return () => modal.close();
    }, [open]);

    return createPortal(
        <dialog onClose={onClose} ref={dialogActors} className="actors__modal">
            {children}
        </dialog>,
        document.body
    );
}