import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"

import './movieNightModal.css';

export default function MovieNightModal({ children, open, onClose }) {

    const dialog = useRef();

    useEffect(() => {
        const modal = dialog.current;
        if (open) {
            dialog.current.showModal();
        }

        return () => modal.close();
    }, [open]);

    return createPortal(
        <dialog onClose={onClose} ref={dialog} className="modal">
            {children}
        </dialog>, 
        document.getElementById('modal')
    );
}