(() => {
  let dbURL = 'http://localhost:3000/3040'

  fetch(dbURL).then(response => response.json()).then(
    response => {
      userName.innerText = response.name;
      userCash.innerText = response.cash + ' $';
      userPic.src = response.picture;
    }
  )
})();