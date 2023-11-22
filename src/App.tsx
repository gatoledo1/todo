import { useEffect, useState } from "react";
import styles from "./App.module.css";
import { Header } from "./components/Header";
import { List } from "./components/List";
import Modal from "./components/Modal";

function App() {
  const [isModalOpen, setModalIsOpen] = useState(false);
  const [stateLocalStorage, setStateLocalStorage] = useState("");
  const arrayKeyStorage = Object.keys(localStorage).filter(item => item?.startsWith("todo-"))
    .map((item) => item?.replace("todo-", ""))

  const toggleModal = (addItem: boolean) => {
    if(arrayKeyStorage.length > 0 || addItem) {
      setModalIsOpen(!isModalOpen);
    }
	};

  useEffect(() => {
    if(arrayKeyStorage.length === 0) {
      setModalIsOpen(true)
    } else if(!stateLocalStorage) {
      setStateLocalStorage(arrayKeyStorage[0])
    }
  
    return () => {
      setModalIsOpen(false)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <Header>
        <button className={styles.newContext} onClick={() => toggleModal(false)}>New context</button>
      </Header>
      <main className={styles.content}>
        <List storageName={stateLocalStorage || arrayKeyStorage[0]}>
          <div className={styles.containerScroll}>
            <div className={styles.tabStorage}>
              {
                arrayKeyStorage.length > 0 && 
                arrayKeyStorage.map((item, index) => {
                  return (
                    <a key={index} {...(item == stateLocalStorage && { className: styles.active })} onClick={() => setStateLocalStorage(item)}>{item}</a>
                  )
                })
              }
            </div>
          </div>
        </List>
      </main>
      {isModalOpen && <Modal setName={setStateLocalStorage} onRequestClose={toggleModal} />}
    </div>
  );
}

export default App;
