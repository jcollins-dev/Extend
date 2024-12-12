export function checkScreenSize(
  fnSetUseStateScreenSize: React.Dispatch<React.SetStateAction<boolean>>,
  sizeToCheck = 1200
) {
  return (): void => {
    if (window.innerWidth < sizeToCheck) {
      fnSetUseStateScreenSize(true);
    } else {
      fnSetUseStateScreenSize(false);
    }
  };
}
