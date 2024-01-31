import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { usePolicy } from "../Contexts/PolicyContext";
import dataConnect from "../Connections/NovaConnection";

import LogOutButton from "../Components/LogOutButton";
import FollowedCard from "../Components/FollowedCard";
import UsersList from "../Components/UsersList";

import Moon from "../Assets/Images/Moon.svg";
import style from "./ResultPage.module.css";

export default function ResultPage() {
  const navigate = useNavigate();
  const { user } = useAuth(true);
  const { policy } = usePolicy();

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState(null);

  function changeSelectedUser(value) {
    setSelectedUser(value);
  }

  async function getUsers() {
    try {
      const response = await dataConnect.get("/user/getAllUser/");

      setUsers(response.data.users);
    } catch {}
  }

  useEffect(() => {
    if (policy && !policy.SHOW_FOLLOWER) {
      if (!user?.isEnrolled) {
        navigate("/enroll");
      } else if (new Date(user?.Schedule?.exit_at) > Date.now()) {
        navigate("/");
      }
    }

    if (user && users) {
      setSelectedUser(users.find((el) => el.user_id === user.user_id));
    }
  }, [policy, user, users, navigate]);

  useEffect(() => {
    if (policy && policy.SHOW_FOLLOWER) {
      getUsers();
    }
  }, [policy]);

  return (
    <>
      {policy && (
        <>
          {policy?.SHOW_FOLLOWER ? (
            <>
              {users && (
                <div className={style.resultContainer}>
                  <LogOutButton />
                  <h1 className={style.resultHeader}>마니또 결과</h1>
                  {selectedUser && (
                    <>
                      <p className={style.followedText}>
                        <span className={style.name}>{selectedUser.name}</span>
                        의 천사는
                      </p>
                      <ul className={style.followedContainer}>
                        {selectedUser.followed.map((el, idx) => (
                          <FollowedCard key={idx} value={el} />
                        ))}
                      </ul>
                    </>
                  )}
                  <UsersList
                    className={style.userList}
                    values={users}
                    value={selectedUser}
                    onClick={changeSelectedUser}
                  />
                </div>
              )}
            </>
          ) : (
            <div className={`${style.resultContainer} ${style.center}`}>
              <LogOutButton />
              <img
                className={style.resultMatchingImage}
                src={Moon}
                alt="Moon"
              />
              <h1 className={style.resultMatchingHeader}>See you next time</h1>
              <p className={style.resultMatchingDescription}>
                마니또 결과를 기다려주세요..!
              </p>
            </div>
          )}
        </>
      )}{" "}
    </>
  );
}
