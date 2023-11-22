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
	const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = "visible";
		};
	});

	function handleTypeNewTaskText(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

	function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
  }

	async function setLocalStorage() {
		let clipboardContent = '';

    try {
      clipboardContent = await navigator.clipboard.readText();
    } catch (err) {
      console.error('Erro ao acessar o clipboard:', err);
    }

    const data = isChecked ? clipboardContent : [];

    localStorage.setItem("todo-" + value, String(data))
		setName(value)
		onRequestClose(true)
  }

	return (
		<div className={styles.modalWindow}>
      <form>
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
				<label>
          <input
						className={styles.inputCheck}
            type="checkbox"
            checked={isChecked}
            onChange={(e) => handleCheckboxChange(e)}
          />
          Import tasks
        </label>

				<button type="submit" className={inputStyles.listButtonNewTask} onClick={() => setLocalStorage()}>
					Continue <Plus size={20}></Plus>
				</button>
      </form>
    </div>
	);
}
