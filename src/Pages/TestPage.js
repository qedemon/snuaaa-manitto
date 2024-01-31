import { useAuth } from "../Contexts/AuthContext";
import dataConnect from "../Connections/NovaConnection";

import Button from "../Components/Button";
import LogOutButton from "../Components/LogOutButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePolicy } from "../Contexts/PolicyContext";

const style = {
  testContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: "8px",
  },

  button: {
    width: "50%",
  },
};

export default function TestPage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth(true);
  const { policy, updatePolicy } = usePolicy();

  async function handleAdmin(value) {
    const response = await dataConnect.post("user/makeMeAdmin", {
      isAdmin: value,
    });
    if (response.data.result === 0) {
      updateUser("isAdmin", value);
    }
  }

  async function handleOpenManitto(value) {
    updatePolicy({
      SHOW_FOLLOWEE: value,
    });
  }

  async function handleOpenResult(value) {
    updatePolicy({
      SHOW_FOLLOWER: value,
    });
  }

  async function deleteMe() {
    const response = await dataConnect.post("user/deleteUser", {
      user_id: user.user_id,
    });
    if (response.data.result === 0) {
      logout();
    }
  }

  useEffect(() => {
    if (user?.valid && !user?.isEnrolled) {
      navigate("/enroll");
    }
  }, [user, navigate]);

  return (
    <>
      {user?.valid && user?.isEnrolled && (
        <div style={style.testContainer}>
          <LogOutButton />
          <Button
            style={style.button}
            onClick={() => {
              handleAdmin(!user.isAdmin);
            }}
          >
            {user.isAdmin ? "어드민 해제" : "어드민으로"}
          </Button>
          <Button style={style.button} onClick={deleteMe}>
            나 등록 삭제
          </Button>
          {user.isAdmin && (
            <>
              <Button
                style={style.button}
                onClick={() => {
                  handleOpenManitto(!policy.SHOW_FOLLOWEE);
                }}
              >
                {policy.SHOW_FOLLOWEE ? "마니또 공개 해제" : "마니또 공개"}
              </Button>

              <Button
                style={style.button}
                onClick={() => {
                  handleOpenResult(!policy.SHOW_FOLLOWER);
                }}
              >
                {policy.SHOW_FOLLOWER ? "결과 공개 해제" : "결과 공개"}
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}
