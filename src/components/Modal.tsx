import React, { useEffect, useState } from 'react'
import { Plus, XCircle } from "phosphor-react";
import styles from "./Modal.module.css";
import inputStyles from "./List.module.css";

interface Modal {
	setName: React.Dispatch<React.SetStateAction<string>>, 
	onRequestClose: (addItem: boolean) => void;
}

export default function Modal({setName, onRequestClose}: Modal) {
	const [value, setValue] = useState("")

  useEffect(() => {
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "visible";
		};
	});

	function handleTypeNewTaskText(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

	function setLocalStorage() {
    localStorage.setItem("todo-" + value, JSON.stringify([]))
		setName(value)
		onRequestClose(true)
  }

	return (
		<div className={styles.modalWindow}>
      <div>
        <a onClick={() => onRequestClose(false)} className={styles.modalClose}>
					<XCircle size={24}></XCircle>
				</a>
        <h3>Give your list a name</h3>
        <input
					placeholder="Add a new name"
					type="text"
					value={value}
					required
					onChange={(e) => handleTypeNewTaskText(e)}
					className={inputStyles.listInputNewTask}
				/>
				<button type="submit" className={inputStyles.listButtonNewTask} onClick={() => setLocalStorage()}>
					Continue <Plus size={20}></Plus>
				</button>
      </div>
    </div>
	);
}
