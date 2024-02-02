import { indexToText } from "../Utils/Time";
import Stars from "./Stars";

import style from "./FollowedCard.module.css";

export default function FollowedCard({ value }) {
  const userData = value?.user_info;
  const mission = userData?.mission;

  return (
    <li className={style.followedCardContainer}>
      <p className={style.followedName}>{userData?.name}</p>
      <p className={style.followedMajor}>
        {userData?.col_no} - {userData?.major}
      </p>
      <p className={style.followedTime}>
        {indexToText(value?.start?.major, value?.start?.minor)} ~{" "}
        {indexToText(value?.end?.major, value?.end?.minor)}
      </p>
      <Stars
        className={style.followedMissionDifficulty}
        value={mission?.difficulty}
      />
      <p className={style.followedMissionDescription}>
        {mission?.description}
      </p>
    </li>
  );
}
