/**
 * 랜덤 색상 생성하는 함수 (밝은 색상)
 * 
 * @returns {string} 랜덤 색상
 */
export function getRandomLightColor () {
  const letters = 'BCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};