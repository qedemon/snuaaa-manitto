import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import dataConnect from "../Connections/NovaConnection";
import { usePolicy } from "../Contexts/PolicyContext";

import ManittoModifyContent from "../Components/ManittoModifyContent";
import ButtonSelector from "../Components/ButtonSelector";
import LogOutButton from "../Components/LogOutButton";
import BackButton from "../Components/BackButton";
import Button from "../Components/Button";

import RightArrow from "../Assets/Images/RightArrow.svg";
import Cycle from "../Assets/Images/Cycle.svg";
import style from "./AdminModifyManittoPage.module.css";

export default function AdminModifyManittoPage() {
  const navigate = useNavigate();
  const { user } = useAuth(true);
  const { updatePolicy } = usePolicy();
  const [connectionDocumentList, setConnectionDocumentList] = useState({});
  const [modifiedConnectionDocumentList, setModifiedConnectionDocumentList] =
    useState({});

  const [modifyState, setModifyState] = useState(false);

  async function getConnectionDocumentList() {
    [0, 1, 2].forEach(async (idx) => {
      const response = await dataConnect.get(
        `/connection/getConnectionDocument/${idx}`
      );
      if (response.data.result === 0) {
        setConnectionDocumentList((prevConnectionDocumentList) => ({
          ...prevConnectionDocumentList,
          [idx]: response.data.data,
        }));
      }
    });
  }

  async function postConnectionDocumentList() {
    [0, 1, 2].forEach(async (idx) => {
      const data = {
        day: idx,
        data: modifiedConnectionDocumentList[idx],
      };
      const response = await dataConnect.post(
        "connection/postConnectionDocument",
        data
      );
      if (response.data.result === 0) {
        setConnectionDocumentList((prevConnectionDocumentList) => ({
          ...prevConnectionDocumentList,
          [idx]: response.data.data,
        }));
        updatePolicy({
          SHOW_FOLLOWEE: true,
        });
      }
    });
  }

  async function autoConnect(command) {
    const data = {
      command,
      data: Object.values(modifiedConnectionDocumentList),
    };

    const response = await dataConnect.post(
      "/connection/requestAutoConnect",
      data
    );
    if (response.data.result === 0) {
      const nextModifiedConnectionDocument = {};
      response.data.data.forEach((el, idx) => {
        nextModifiedConnectionDocument[idx] = el;
      });
      setModifiedConnectionDocumentList(nextModifiedConnectionDocument);
    }
  }

  function copyDocumentList(documentList, index) {
    if (index !== undefined) {
      const connectionGroups = [];
      documentList[index].connectionGroups.forEach((val) => {
        connectionGroups.push([...val]);
      });
      return {
        connected: [...documentList[index].connected],
        connectionGroups,
        disconnected: [...documentList[index].disconnected],
      };
    } else {
      const nextDocumentList = {};
      for (const [key, value] of Object.entries(documentList)) {
        const connectionGroups = [];
        value.connectionGroups.forEach((val) => {
          connectionGroups.push([...val]);
        });
        nextDocumentList[key] = {
          connected: [...value.connected],
          connectionGroups,
          disconnected: [...value.disconnected],
        };
      }
      return nextDocumentList;
    }
  }

  function changeModifyState(val, idx) {
    setModifyState(idx);
  }

  function handleAdd(dateIndex, popIndex, pushIndex) {
    const [circleIndex, userIndex] = pushIndex;
    const nextModifiedConnectionDocument = copyDocumentList(
      modifiedConnectionDocumentList,
      dateIndex
    );
    const { connected, connectionGroups, disconnected } =
      nextModifiedConnectionDocument;
    const connectionGroup = connectionGroups[circleIndex];

    // disconnected에 있던 유저를 connected로 옮기기
    const poppedUser = disconnected.splice(popIndex, 1)[0];
    connected.push(poppedUser);
    const poppedUserId = poppedUser.user_id;

    // connectionGroup에 연결 추가
    const connection = connectionGroup.splice(userIndex, 1)[0];
    connectionGroup.splice(
      userIndex,
      0,
      {
        follower_id: connection.follower_id,
        followee_id: poppedUserId,
      },
      {
        follower_id: poppedUserId,
        followee_id: connection.followee_id,
      }
    );

    setModifiedConnectionDocumentList((prevModifiedConnectionDocumentList) => ({
      ...prevModifiedConnectionDocumentList,
      [dateIndex]: nextModifiedConnectionDocument,
    }));
  }

  function handleDelete(dateIndex, userId, popIndex) {
    const [circleIndex, userIndex] = popIndex;
    const nextModifiedConnectionDocument = copyDocumentList(
      modifiedConnectionDocumentList,
      dateIndex
    );
    const { connected, connectionGroups, disconnected } =
      nextModifiedConnectionDocument;
    const connectionGroup = connectionGroups[circleIndex];

    // connected에 있던 유저를 disconnected로 옮기기
    const poppedUserIndex = connected.findIndex((el) => el.user_id === userId);
    const poppedUser = connected.splice(poppedUserIndex, 1)[0];
    disconnected.push(poppedUser);

    // connectionGroup에 연결 제거
    if (userIndex === 0) {
      // 0번째 인덱스를 삭제했을 때
      const connection = connectionGroup.splice(userIndex, 1)[0];

      // circle이 남지 않게 되어버린 경우 그 circle element를 삭제
      if (connectionGroup.length === 0) {
        connectionGroups.splice(circleIndex, 1);
      } else {
        // cycle이 형성되어있던 경우에 재연결
        const lastConnection = connectionGroup[connectionGroup.length - 1];
        if (connection.follower_id === lastConnection.followee_id) {
          lastConnection.followee_id = connectionGroup[0].follower_id;
        }
      }
    } else {
      // 나머지 인덱스를 삭제했을 때
      const connections = connectionGroup.splice(userIndex - 1, 2);
      connectionGroup.splice(userIndex - 1, 0, {
        follower_id: connections[0].follower_id,
        followee_id: connections[1].followee_id,
      });
    }

    // 남은 user가 1명일 경우 cycle 제거
    if (connectionGroup.length === 1) {
      connectionGroup[0].followee_id = null;
    }

    setModifiedConnectionDocumentList((prevModifiedConnectionDocumentList) => ({
      ...prevModifiedConnectionDocumentList,
      [dateIndex]: nextModifiedConnectionDocument,
    }));
  }

  useEffect(() => {
    getConnectionDocumentList();
  }, []);

  useEffect(() => {
    setModifiedConnectionDocumentList(copyDocumentList(connectionDocumentList));
  }, [connectionDocumentList]);

  useEffect(() => {
    if (user) {
      if (!user.isAdmin) {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <>
      {user?.isAdmin && (
        <>
          <LogOutButton />
          <BackButton to={"/admin"} />
          <div className={style.adminContainer}>
            <h1 className={style.adminHeader}>마니또 배정</h1>
            <ButtonSelector
              className={style.modifySelector}
              initialValue={"현재"}
              valuesList={["현재", "편집 창"]}
              onChange={changeModifyState}
            />
            <ManittoModifyContent
              className={style.manittoModifyContent}
              connectionDocumentList={
                modifyState
                  ? modifiedConnectionDocumentList
                  : connectionDocumentList
              }
              modifyState={modifyState}
              onAdd={handleAdd}
              onDelete={handleDelete}
            />
            {modifyState ? (
              <div className={style.buttonContainer}>
                <Button
                  className={`${style.controlButton} ${style.white}`}
                  onClick={() => {
                    autoConnect("linear");
                  }}
                >
                  <img src={RightArrow} alt="right arrow" />
                </Button>
                <Button
                  className={`${style.controlButton} ${style.white}`}
                  onClick={() => {
                    autoConnect("circular");
                  }}
                >
                  <img src={Cycle} alt="right arrow" />
                </Button>
                <Button
                  className={style.controlButton}
                  onClick={postConnectionDocumentList}
                >
                  배포
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      )}
    </>
  );
}
