export function audioNotification(error: boolean) {
  let sound = new Audio();

  switch (error) {
    case false:
      sound = new Audio('sounds/success.ogg');
      break;
    case true:
      sound = new Audio('sounds/failure.ogg');
      break;
  }

  sound.play();
}
