function changeImg(imgNum) {
  //$("#img").attr({src: `./img/0${num}.jpg`})

  // console.log(i);
  $(`#img1`).attr({ class: "hide" });
  $(`#img2`).attr({ class: "hide" });
  $(`#img3`).attr({ class: "hide" });

  $(`#img${imgNum}`).attr({ class: "" });
}

// changeImg(2);
var num = 1;
changeImg(num);

setInterval(function () {
  console.log(num);
  if (num < 3) {
    num++;
  } else {
    num = 1;
  }

  changeImg(num);
}, 5000);
