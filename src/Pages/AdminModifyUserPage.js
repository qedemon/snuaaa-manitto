import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import useAsync from "../Hooks/useAsync";
import {
  getDateList,
  getTimeList,
  indexToTime,
  timeToText,
} from "../Utils/Time";
import dataConnect from "../Connections/NovaConnection";

import LogOutButton from "../Components/LogOutButton";
import BackButton from "../Components/BackButton";
import UsersList from "../Components/UsersList";
import DropDown from "../Components/DropDown";
import Button from "../Components/Button";
import Modal from "../Components/Modal";

import { ReactComponent as Calendar } from "../Assets/Images/Calendar.svg";
import { ReactComponent as Clock } from "../Assets/Images/Clock.svg";
import style from "./AdminModifyUserPage.module.css";

async function updateSchedule(data) {
  try {
    return await dataConnect.post("/user/setSchedule/", data);
  } catch {
    throw new Error("에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
}

function UpdateUserModal({ user, onConfirm, onClose }) {
  const [leaveDate, setLeaveDate] = useState(null);
  const [leaveTime, setLeaveTime] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [isUpdatePending, updateError, updateScheduleAsync] =
    useAsync(updateSchedule);

  function changeLeaveDate(val, idx) {
    setErrorMessage("");
    setLeaveDate(idx);
  }

  function changeLeaveTime(val, idx) {
    setErrorMessage("");
    setLeaveTime(idx);
  }

  async function handleClick() {
    if (leaveDate === null || leaveTime === null) {
      setErrorMessage("퇴거 일자 및 퇴거 시간을 설정해 주세요.");
      return;
    }

    const data = {
      user_id: user.user_id,
      schedule: {
        exit_at: indexToTime(leaveDate, leaveTime),
      },
    };

    const response = await updateScheduleAsync(data);
    if (response?.data?.result === 0) {
      onConfirm(response.data.user);
    }
  }

  useEffect(() => {
    if (updateError) {
      setErrorMessage(updateError.message);
    }
  }, [updateError]);

  return (
    <Modal onClose={onClose} height={250}>
      <div className={style.updateUserModalContent}>
        <div className={style.userInfoContainer}>
          <span className={style.userName}>{user.name}</span>
          <span className={style.userInfo}>
            {user.col_no} - {user.major}
          </span>
        </div>
        <p className={style.userDate}>
          {timeToText(user.schedule.enter_at)}
          {"  "}~{"  "}
          {timeToText(user.schedule.exit_at)}
        </p>
        <div className={style.dropDownContainer}>
          <DropDown
            className={style.leaveDropDown}
            img={Calendar}
            valuesList={getDateList()}
            onChange={changeLeaveDate}
            placeholder="퇴거 일자"
            disabled={null}
          />
          <DropDown
            className={style.leaveDropDown}
            img={Clock}
            valuesList={getTimeList()}
            onChange={changeLeaveTime}
            placeholder="퇴거 시간"
            disabled={null}
          />
        </div>
        <div className={style.updateButtonContainer}>
          <Button
            className={style.updateButton}
            onClick={handleClick}
            disabled={isUpdatePending}
          >
            수정
          </Button>
          <p className={style.errorMessage}>{errorMessage}</p>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminModifyUserPage() {
  const navigate = useNavigate();
  const { user } = useAuth(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(null);

  function changeSelectedUser(value) {
    setSelectedUser(value);
  }

  function handleClose() {
    setSelectedUser(null);
  }

  function handleConfirm(data) {
    const nextUsers = users;
    const changedUserIndex = nextUsers.findIndex(
      (val) => val.user_id === data.user_id
    );
    nextUsers[changedUserIndex].schedule.exit_at = data.schedule.exit_at;
    setUsers(nextUsers);
    handleClose();
  }

  async function getUsers() {
    try {
      const response = await dataConnect.get("/user/getAllUser/");

      setUsers(response.data.users);
    } catch {}
  }

  useEffect(() => {
    if (user) {
      if (!user.isAdmin) {
        navigate("/");
      } else {
        getUsers();
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
            <h1 className={style.adminHeader}>날짜 수정</h1>
            {users && (
              <UsersList
                className={style.userList}
                values={users}
                value={selectedUser}
                onClick={changeSelectedUser}
              />
            )}
          </div>
          {selectedUser && (
            <UpdateUserModal
              user={selectedUser}
              onClose={handleClose}
              onConfirm={handleConfirm}
            />
          )}
        </>
      )}
    </>
  );
}
