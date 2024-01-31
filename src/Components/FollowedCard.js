import Stars from "./Stars";

import style from "./FollowedCard.module.css";

export default function FollowedCard({ value }) {
  const userData = value?.user_info;

  return (
    <li className={style.followedCardContainer}>
      <p className={style.followedName}>{userData?.name}</p>
      <p className={style.followedMajor}>
        {userData?.col_no} - {userData?.major}
      </p>
      <p className={style.followedTime}>시간</p>
      <Stars
        className={style.followedMissionDifficulty}
        value={value?.mission?.difficulty}
      />
      <p className={style.followedMissionDescription}>
        {value?.mission?.description}
      </p>
    </li>
  );
}
