import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePolicy } from "../Contexts/PolicyContext";
import { useAuth } from "../Contexts/AuthContext";
import useAsync from "../Hooks/useAsync";
import dataConnect from "../Connections/NovaConnection";

import { timeToText } from "../Utils/Time";

import Modal from "../Components/Modal";
import LogOutButton from "../Components/LogOutButton";
import HideFilter from "../Components/HideFilter";
import Stars from "../Components/Stars";
import Button from "../Components/Button";

import Moon from "../Assets/Images/Moon.svg";
import Check from "../Assets/Images/Check.svg";
import style from "./ManittoPage.module.css";

function ExitConfirmModal({ onConfirm, onClose }) {
  const { user, updateUser } = useAuth(true);

  async function updateSchedule(data) {
    try {
      return await dataConnect.post("/user/setSchedule/", data);
    } catch {
      throw new Error("에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  const [isUpdatePending, updateError, updateScheduleAsync] =
    useAsync(updateSchedule);

  async function handleClick() {
    const data = {
      user_id: user.user_id,
      schedule: {
        exit_at: Date.now(),
      },
    };

    const response = await updateScheduleAsync(data);
    if (response?.data?.result === 0) {
      updateUser("Schedule", {
        ...user.Schedule,
        exit_at: response.data.user.schedule.exit_at,
      });
      onConfirm();
    }
  }

  return (
    <Modal onClose={onClose} height={200}>
      <div className={style.confirmModalContent}>
        <p className={style.confirmModalHeader}>
          관측회에서 <span className={style.purple}>퇴거</span> 하시겠습니까?
        </p>
        <p className={style.confirmModalText}>
          퇴거 후 다시 돌아오기를 번복 할 수 없습니다.
          <br />
          퇴거 후에도 마니또 결과를 볼 수 있습니다.
        </p>
        <div className={style.confirmButtonContainer}>
          <Button
            className={style.confirmButton}
            onClick={handleClick}
            disabled={isUpdatePending}
          >
            퇴거 확인
          </Button>
          <p className={style.errorMessage}>
            {updateError && updateError.message}
          </p>
        </div>
      </div>
    </Modal>
  );
}

function ExitCompleteModal({ onClose }) {
  const navigate = useNavigate();

  function handleClose() {
    onClose();
    navigate("/result");
  }

  return (
    <Modal onClose={handleClose} height={200}>
      <div className={style.completeModalContent}>
        <img src={Check} alt="check" />
        <p className={style.completeModalHeader}>관측회에서 퇴거 하였습니다.</p>
        <p className={style.completeModalText}>
          마니또 결과는 관측일 마지막 날에 열람 할 수 있습니다.
        </p>
      </div>
    </Modal>
  );
}

export default function ManittoPage() {
  const navigate = useNavigate();
  const { user } = useAuth(true);
  const { policy } = usePolicy();

  const [mission, setMission] = useState(null);
  const [manitto, setManitto] = useState(null);

  const [hideState, setHideState] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [exitState, setExitState] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [ableToSubscribe, setAbleToSubscribe] = useState(false);
  const [subscriptionPending, setSubscriptionPending] = useState(false);

  function showModal(e) {
    e.stopPropagation();
    setModalState(true);
  }

  function closeModal() {
    setModalState(false);
  }

  function confirmExit() {
    setExitState(true);
  }

  async function subscribe() {
    async function postSubscription(userInfo, subscription) {
      return (
        await dataConnect.post("/push/registerPush", {
          user_id: userInfo.user_id,
          subscription,
        })
      ).data;
    }
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("serviceWorker not impelemented");
      }
      const vapidKey = await (async () => {
        const { result, error, key } = (
          await dataConnect.get("/push/getVAPIDKey")
        ).data;
        if (result !== 0) {
          throw error;
        }
        return key.public;
      })();
      const userInfo = await (async () => {
        const { result, error, origin, userInfo } = (
          await dataConnect.get("/user/whoami")
        ).data;
        if (result !== 0) {
          throw error;
        }
        if (origin !== "local") {
          throw new Error("unregisterd user");
        }
        return userInfo;
      })();

      /*const permission = await Notification.requestPermission();
      if(permission === "denied"){
          throw new Error("permission denied");
      }*/

      if (navigator.serviceWorker) {
        await navigator.serviceWorker.register(`serviceworker.js`);
        const registration = await navigator.serviceWorker.ready;

        const pushSubscription =
          (await registration.pushManager.getSubscription()) ||
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidKey,
          }));

        await (async () => {
          const { error /*, user*/ } = await postSubscription(
            userInfo,
            pushSubscription
          );
          if (error) {
            throw error;
          }
        })();
        setSubscription(pushSubscription);
      }
    } catch (error) {
      console.error(error);
      alert("알람 설정 도중 에러가 발생하였습니다.");
    }
  }

  async function unsubscribe() {
    if (subscription) {
      const result = await subscription.unsubscribe();
      if (result) {
        setSubscription(null);
      }
    }
  }

  async function handleSubscribe(e) {
    e.stopPropagation();
    setSubscriptionPending(true);
    if (ableToSubscribe) {
      await (subscription ? unsubscribe : subscribe)();
    }
    setSubscriptionPending(false);
  }

  // 마니또, 미션 데이터 업데이트
  useEffect(() => {
    if (user?.Mission) {
      setMission(user.Mission);
    }

    if (user?.following) {
      const nextManitto = user.following.find((el) => el.isValid);
      if (nextManitto) {
        const leaveTime = timeToText(nextManitto.exit_at);
        setManitto({
          ...nextManitto,
          leaveTime,
        });
      }
    }
  }, [policy, user]);

  // 유저 상태에 따라 다른 페이지로 리다이렉트
  useEffect(() => {
    if (policy && user) {
      if (user?.isAdmin) {
        navigate("/admin");
      } else if (policy.SHOW_FOLLOWER) {
        navigate("/result");
      } else {
        if (!user?.isEnrolled) {
          navigate("/enroll");
        } else if (new Date(user?.Schedule?.exit_at) < Date.now()) {
          if (!modalState) {
            navigate("/result");
          }
        }
      }
    }
  }, [user, policy, modalState, navigate]);

  // 숨기기 필터
  useEffect(() => {
    const toggleHide = () => {
      setHideState((prevHide) => !prevHide);
    };
    document.addEventListener("click", toggleHide);
    return () => {
      document.removeEventListener("click", toggleHide);
    };
  }, []);

  // subscription 체크
  useEffect(() => {
    (async () => {
      setAbleToSubscribe(navigator.serviceWorker);
      if (navigator.serviceWorker) {
        const registration = await navigator.serviceWorker.ready;
        setSubscription(await registration.pushManager?.getSubscription());
      }
    })();
  }, []);

  return (
    <>
      {policy?.SHOW_FOLLOWEE && mission && manitto ? (
        <>
          <HideFilter hide={hideState} />
          <div className={style.manittoContainer}>
            <LogOutButton />
            <h1 className={style.manittoHeader}>나의 마니또</h1>
            <p className={style.manittoHideAlertText}>터치해서 숨기기</p>
            <img className={style.manittoImage} src={Moon} alt="Moon" />
            <p className={style.manittoInfo}>
              {manitto.name} - {manitto.col_no}학번 {manitto.major}
            </p>
            <p className={style.manittoLeaveDateText}>
              {manitto.leaveTime} 퇴거 예정
            </p>
            <p className={style.manittoMissionHeaderText}>마니또 미션</p>
            <Stars
              className={style.manittoMissionDifficulty}
              value={mission.difficulty}
            />
            <p className={style.manittoMissionText}>{mission.description}</p>
            <p className={style.manittoDescription}>
              주의: 마니또 예상 퇴거시간에 따라 나의 마니또가 변경 될 수
              있습니다. <br />
              마니또 배정은 식사시간 업데이트로 반영됩니다.
            </p>
            <Button className={style.exitButton} onClick={showModal}>
              퇴거하기
            </Button>
            {ableToSubscribe !== null ? (
              <Button
                className={style.subscribeButton}
                onClick={handleSubscribe}
                disabled={subscriptionPending}
              >
                {subscription ? "알람 설정 해제" : "알람 설정"}
              </Button>
            ) : (
              <></>
            )}
            {modalState &&
              (!exitState ? (
                <ExitConfirmModal
                  onConfirm={confirmExit}
                  onClose={closeModal}
                />
              ) : (
                <ExitCompleteModal onClose={closeModal} />
              ))}
          </div>
        </>
      ) : (
        <div className={style.manittoContainer}>
          <LogOutButton />
          <img className={style.manittoMatchingImage} src={Moon} alt="Moon" />
          <h1 className={style.manittoMatchingHeader}>Matching...</h1>
          <p className={style.manittoMatchingDescription}>
            마니또가 매칭될 때 까지 잠시만 기다려주세요.
          </p>
        </div>
      )}
    </>
  );
}
