import { useEffect, useState } from "react";

import ManittoCircleList from "./ManittoCircleList";

import style from "./ManittoModifyContent.module.css";

const CATEGORIES = ["1~2일", "2~3일", "3~4일"];

export default function ManittoModifyContent({
  className = "",
  connectionDocumentList,
  onAdd,
  onDelete,
  modifyState,
}) {
  const [dateState, setDateState] = useState(0);
  const [connectionDocument, setConnectionDocument] = useState(null);

  function handleAdd(popIndex, pushIndex) {
    onAdd(dateState, popIndex, pushIndex);
  }

  function handleDelete(userId, popIndex) {
    onDelete(dateState, userId, popIndex);
  }

  useEffect(() => {
    if (connectionDocumentList) {
      const connectionDocument = connectionDocumentList[dateState];
      if (connectionDocument) {
        setConnectionDocument({
          connected: [...connectionDocument.connected],
          connectionGroups: [...connectionDocument.connectionGroups],
          disconnected: [...connectionDocument.disconnected],
        });
      }
    }
  }, [connectionDocumentList, dateState]);

  return (
    <div className={`${style.manittoModifyContainer} ${className}`}>
      <div className={style.daySelectContainer}>
        {CATEGORIES.map((el, idx) => (
          <div
            key={idx}
            className={`${style.daySelectButton} ${
              dateState === idx ? style.selected : ""
            }`}
            onClick={() => {
              setDateState(idx);
            }}
          >
            {el}
          </div>
        ))}
      </div>
      <div className={style.manittoContainer}>
        {connectionDocument && (
          <ManittoCircleList
            connectionDocument={connectionDocument}
            modifyState={modifyState}
            onAdd={handleAdd}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
