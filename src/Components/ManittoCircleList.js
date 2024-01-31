import { useEffect, useState } from "react";
import { indexToText } from "../Utils/Time";
import { motion } from "framer-motion";

import AddButton from "../Assets/Images/Add.svg";
import DeleteButton from "../Assets/Images/Delete.svg";
import style from "./ManittoCircleList.module.css";

const variants = {
  close: {
    opacity: 0,
    top: 0,
  },
  open: {
    opacity: 1,
    top: 40,
  },
};

export default function ManittoCircleList({
  connectionDocument,
  onAdd,
  onDelete,
  modifyState,
}) {
  const [connectedUserList, setConnectedUserList] = useState(null);
  const [openedIndex, setOpenedIndex] = useState(null);

  function addUser(idx) {
    onAdd(idx, openedIndex);
    setOpenedIndex(null);
  }

  function deleteUser(userId, popIndex) {
    onDelete(userId, popIndex);
  }

  // 각 사이클 별 유저 커넥션 리스트 생성
  useEffect(() => {
    if (connectionDocument) {
      const { connected, connectionGroups } = connectionDocument;
      const nextConnectedUserList = [];
      connectionGroups.forEach((connection) => {
        const cycled =
          connection[connection.length - 1].followee_id ===
          connection[0].follower_id;
        const connectedUserCircle = {
          list: [],
          cycled,
        };

        connection.forEach(({ follower_id }) => {
          connectedUserCircle.list.push(
            connected.find((el) => el.user_id === follower_id)
          );
        });

        if (!cycled && connection[connection.length - 1].followee_id !== null) {
          connectedUserCircle.list.push(
            connected.find(
              (el) =>
                el.user_id === connection[connection.length - 1].followee_id
            )
          );
        }
        nextConnectedUserList.push(connectedUserCircle);
      });
      setConnectedUserList(nextConnectedUserList);
    }
  }, [connectionDocument]);

  // 드롭다운이 오픈되었을 때 바깥 부분을 누르면 닫게 만들기
  useEffect(() => {
    if (openedIndex !== null) {
      const closeWindow = (e) => {
        if (e.target?.alt !== "add") {
          e.stopPropagation();
          setOpenedIndex(null);
        }
      };

      document.addEventListener("click", closeWindow);

      return () => {
        document.removeEventListener("click", closeWindow);
      };
    }
  }, [openedIndex]);

  return (
    <>
      {connectedUserList && (
        <div className={style.manittoCircleContainer}>
          {connectedUserList.map((connectedUser, circleIdx) => (
            <div
              key={circleIdx}
              className={`${style.circleContainer} ${
                !connectedUser.cycled ? style.uncycled : ""
              }`}
            >
              {connectedUser.list.map((el, idx) => (
                <div className={style.userContainer} key={idx}>
                  <p className={style.userName}>{el.name}</p>
                  <p className={style.userInfo}>
                    {el.col_no} - {el.major}
                  </p>
                  <p className={style.userTime}>
                    {indexToText(
                      el.schedule.enter_at.major,
                      el.schedule.enter_at.minor
                    )}
                    {"  "}~{"  "}
                    {indexToText(
                      el.schedule.exit_at.major,
                      el.schedule.exit_at.minor
                    )}
                  </p>
                  {modifyState ? (
                    <>
                      <div
                        className={style.button}
                        onClick={() => {
                          setOpenedIndex([circleIdx, idx]);
                        }}
                      >
                        <img src={AddButton} alt="add" />
                      </div>
                      <div
                        className={style.button}
                        onClick={() => {
                          deleteUser(el.user_id, [circleIdx, idx]);
                        }}
                      >
                        <img src={DeleteButton} alt="delete" />
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                  {openedIndex &&
                  openedIndex[0] === circleIdx &&
                  openedIndex[1] === idx ? (
                    <motion.div
                      className={style.dropDownListContainer}
                      variants={variants}
                      initial="close"
                      animate="open"
                      exit="close"
                    >
                      <ul className={style.dropDownList}>
                        {connectionDocument.disconnected?.map((val, idx) => (
                          <li key={idx} className={style.dropDownListItem}>
                            <button
                              value={idx}
                              className={style.dropDownListItemButton}
                              onClick={() => {
                                addUser(idx);
                              }}
                              disabled={openedIndex === null}
                            >
                              <p className={style.disconnectedUserName}>
                                {val.name}
                              </p>
                              <p className={style.disconnectedUserInfo}>
                                {val.col_no} - {val.major}
                              </p>
                              <p className={style.disconnectedUserTime}>
                                {indexToText(
                                  val.schedule.enter_at.major,
                                  val.schedule.enter_at.minor
                                )}
                                {"  "}~{"  "}
                                {indexToText(
                                  val.schedule.exit_at.major,
                                  val.schedule.exit_at.minor
                                )}
                              </p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
