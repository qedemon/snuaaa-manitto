import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { usePolicy } from "../Contexts/PolicyContext";
import { getDateList, getTimeList, indexToTime } from "../Utils/Time";

import DifficultySelector from "../Components/DifficultySelector";
import ButtonSelector from "../Components/ButtonSelector";
import LogOutButton from "../Components/LogOutButton";
import DropDown from "../Components/DropDown";
import Button from "../Components/Button";

import { ReactComponent as Calendar } from "../Assets/Images/Calendar.svg";
import { ReactComponent as Clock } from "../Assets/Images/Clock.svg";
import Moon from "../Assets/Images/Moon.svg";
import style from "./EnrollPage.module.css";
import useAsync from "../Hooks/useAsync";

// TODO: 마니또 공개 시점 이후로부터는 부분참으로만 등록 가능
// TODO: 1일차 저녁만 등록 가능, 4일차는 점심까지만 등록 가능

export default function ManittoPage() {
  const navigate = useNavigate();
  const { user, register } = useAuth(true);
  const { policy } = usePolicy();

  const [allAttend, setAllAttend] = useState(true);
  const [leaveDate, setLeaveDate] = useState(null);
  const [leaveTime, setLeaveTime] = useState(null);
  const [missionDiff, setMissionDiff] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  const [isRegisterPending, registerError, registerAsync] = useAsync(register);

  function changeAllAttend(val, idx) {
    setErrorMessage("");
    setAllAttend(!idx);
  }

  function changeLeaveDate(val, idx) {
    setErrorMessage("");
    setLeaveDate(idx);
  }

  function changeLeaveTime(val, idx) {
    setErrorMessage("");
    setLeaveTime(idx);
  }

  async function handleSubmit() {
    if (!allAttend && (leaveDate === null || leaveTime === null)) {
      setErrorMessage("부분참일 시, 예상 퇴거 시각을 설정해 주세요.");
      return;
    }

    if (missionDiff === 0) {
      setErrorMessage("마니또 미션 난이도를 설정해 주세요.");
      return;
    }

    const data = {
      mission_rank: missionDiff,
      exit_at: allAttend
        ? indexToTime(3, 1)
        : indexToTime(leaveDate, leaveTime),
    };

    try {
      await registerAsync(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  // 에러 발생 시 에러 메시지 변경
  useEffect(() => {
    setErrorMessage(registerError?.message ?? "");
  }, [registerError]);

  // 유저 상태에 따라 다른 페이지로 리다이렉트
  useEffect(() => {
    if (policy && user) {
      if (policy.SHOW_FOLLOWER) {
        navigate("/result");
      } else if (user?.isAdmin) {
        navigate("/admin");
      } else if (user?.isEnrolled) {
        navigate("/");
      }
    }
  }, [user, policy, navigate]);

  return (
    <>
      {policy && user?.valid && (
        <>
          <LogOutButton />
          <div className={style.enrollContainer}>
            <h1 className={style.enrollFirstHeader}>Welcome</h1>
            <h2 className={style.enrollSecondHeader}>마니또 등록하기</h2>
            <img className={style.enrollImage} src={Moon} alt="Moon" />
            <p className={style.userInfoContainer}>{user.name}</p>
            <p className={style.userInfoContainer}>
              {user.col_no} - {user.major}
            </p>
            <ButtonSelector
              className={style.attendButtonSelector}
              initialValue={allAttend ? "전참" : "부분참"}
              valuesList={["전참", "부분참"]}
              onChange={changeAllAttend}
            />
            <div className={style.leaveTimeSelectContainer}>
              <DropDown
                className={style.leaveTimeSelect}
                img={Calendar}
                valuesList={getDateList()}
                onChange={changeLeaveDate}
                placeholder="예상 퇴거 일자"
                disabled={allAttend}
              />
              <DropDown
                className={style.leaveTimeSelect}
                img={Clock}
                valuesList={getTimeList()}
                onChange={changeLeaveTime}
                placeholder="예상 퇴거 시간"
                disabled={allAttend}
              />
            </div>
            <div className={style.difficultySelectContainer}>
              <p className={style.difficultySelectorText}>미션 난이도</p>
              <DifficultySelector
                value={missionDiff}
                onChange={setMissionDiff}
              />
            </div>
            <p className={style.enrollDescription}>
              부분참 예상 퇴거 시간 변경은 마니또짱에게 문의 해주세요.
              <br />
              미션 난이도는 변경 할 수 없으며 미션은 랜덤으로 정해집니다.
            </p>
            <div className={style.buttonContainer}>
              <Button
                className={style.manittoEnrollButton}
                onClick={handleSubmit}
                disabled={isRegisterPending}
              >
                마니또 배정
              </Button>
              <p className={style.errorMessage}>{errorMessage}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
