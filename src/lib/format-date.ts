import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from 'date-fns';

/**
 * 날짜 차이를 계산한다
 * @param base 기준으로 할 date
 * @param target 기준과 비교할 date
 * @returns 차이가 1분 이내이면 방금, 1시간 이내이면 n분 전, 하루 이내이면 n시간 전, 일주일 이내이면 n일 전, 한 달 이내이면 n주 전, 이후로는 n달 전
 */
export function formatDistance(
  base: Date | number,
  target: Date | number,
): string {
  const minutesDiff = differenceInMinutes(base, target);

  if (minutesDiff === 0) return '방금';
  if (minutesDiff < 60) return `${minutesDiff}분 전`;

  const hoursDiff = differenceInHours(base, target);
  if (hoursDiff < 24) return `${hoursDiff}시간 전`;

  const daysDiff = differenceInDays(base, target);
  if (daysDiff < 7) return `${daysDiff}일 전`;

  const weeksDiff = differenceInWeeks(base, target);
  const monthsDiff = differenceInMonths(base, target);
  if (monthsDiff < 2) return `${weeksDiff}주 전`;
  return `${monthsDiff}달 전`;
}

/**
 * 날짜 문자열을 `YYYY년 MM월 DD일` 문자열로 변환해준다
 * @param date
 * @returns `YYYY년 MM월 DD일`
 */
export function formatToKRLocaleString(date: Date | string | number): string {
  return new Date(date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
