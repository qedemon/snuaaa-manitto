import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePolicy } from "../Contexts/PolicyContext";
import { useAuth } from "../Contexts/AuthContext";
import useAsync from "../Hooks/useAsync";

import LogOutButton from "../Components/LogOutButton";
import Button from "../Components/Button";
import Modal from "../Components/Modal";

import Moon from "../Assets/Images/Moon.svg";
import style from "./AdminPage.module.css";

function OpenResultConfirmModal({ onConfirm, onClose }) {
  const { updatePolicy } = usePolicy();

  async function openResult() {
    return updatePolicy({
      SHOW_FOLLOWER: true,
    });
  }

  const [isUpdatePending, updateError, openResultAsync] = useAsync(openResult);

  async function handleClick() {
    const response = await openResultAsync();
    if (response?.data?.result === 0) {
      onConfirm();
    }
  }

  return (
    <Modal onClose={onClose} height={200}>
      <div className={style.confirmModalContent}>
        <p className={style.confirmModalHeader}>
          <span className={style.purple}>마니또 결과</span>를 배포하시겠습니까?
        </p>
        <p className={style.confirmModalText}>
          마니또 결과는 관측회 마지막날에 배포되어야 합니다.
        </p>
        <div className={style.confirmButtonContainer}>
          <Button
            className={style.confirmButton}
            onClick={handleClick}
            disabled={isUpdatePending}
          >
            배포
          </Button>
          <p className={style.errorMessage}>
            {updateError && updateError.message}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth(true);
  const { policy, updatePolicy } = usePolicy();

  const [modalState, setModalState] = useState(false);

  function showModal(e) {
    setModalState(true);
  }

  function closeModal() {
    setModalState(false);
  }

  function closeResult() {
    return updatePolicy({
      SHOW_FOLLOWER: false,
    });
  }

  const [isUpdatePending, updateError, closeResultAsync] =
    useAsync(closeResult);

  async function handleClick() {
    await closeResultAsync();
  }

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
        <div className={style.adminContainer}>
          <LogOutButton />
          <img className={style.adminImage} src={Moon} alt="moon" />
          <h1 className={style.adminHeader}> 관리자 모드</h1>
          <Button
            className={`${style.adminButton} ${style.gray}`}
            onClick={() => {
              navigate("/admin/modify-manitto");
            }}
          >
            마니또 배정
          </Button>
          <Button
            className={`${style.adminButton} ${style.gray}`}
            onClick={() => {
              navigate("/admin/modify-user");
            }}
          >
            날짜 수정
          </Button>
          <div className={style.resultButtonContainer}>
            <Button
              className={style.adminButton}
              onClick={policy.SHOW_FOLLOWER ? handleClick : showModal}
              disabled={isUpdatePending}
            >
              {policy.SHOW_FOLLOWER ? "결과 배포 해제" : "결과 배포"}
            </Button>
            <p className={style.errorMessage}>
              {updateError && updateError.message}
            </p>
          </div>
          {modalState && (
            <OpenResultConfirmModal
              onConfirm={closeModal}
              onClose={closeModal}
            />
          )}
        </div>
      )}
    </>
  );
}
