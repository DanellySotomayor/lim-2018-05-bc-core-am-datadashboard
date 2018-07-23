const responseContainerEl = document.getElementById('container-user');
const cohortSelect = document.getElementById('cohortSelect');
const contentTable = document.getElementById('show-stats-and-order');
const content = document.getElementById('content');
const orderSelect = document.getElementById('orderSelect');
const searchInput = document.getElementById('search-input');
const showStatsLima = document.getElementById('lim');
const usersUrl = '../data/cohorts/lim-2018-03-pre-core-pw/users.json';
const progressUrl = '../data/cohorts/lim-2018-03-pre-core-pw/progress.json';
const cohortsUrl = '../data/cohorts.json';
let currentCohort;
let users;
let progress;
let cohorts;


//llamando a la data users y enlazandolo con progress
const saveUsers = (event) => {
  users = JSON.parse(event.target.responseText);
  getData(progressUrl, saveProgress, 'progress');
}
//llamando a la data progress y enlazandolo con cohorts
const saveProgress = (event) => {
  progress = JSON.parse(event.target.responseText);
  getData(cohortsUrl, saveCohorts, 'cohorts');
}
//llamando a cohorts, imprimiendo en selector y llamando a la tabla de stats
const saveCohorts = (event) => {
  cohorts = JSON.parse(event.target.responseText);
  
  //para listar los cohorts filtrados por "lim"
  cohorts.forEach((cohort) => {
    let nameCohorts = cohort.id;
    if (nameCohorts.indexOf('lim') === 0){
      cohortSelect.innerHTML += `<option value="${nameCohorts}">${nameCohorts}</option>`
    }
  });

  //llamando al botón "lim" para cargar la lista de cohorts de Lima
  showStatsLima.addEventListener('click', () => {
    content.classList.add('loaded');
    });
    
  //sirve para mostrar la tabla con los stats
  cohortSelect.addEventListener('change', () => { 
    contentTable.classList.add('loaded'); 
    currentCohort = cohorts.find((cohort) => {
      return cohort.id === 'lim-2018-03-pre-core-pw';
    });
    
    const options = {
      cohort : currentCohort,
      cohortData : {users, progress},
      orderBy: '',
      orderDirection: '',
      search: '',
    }
    const newUser = processCohortData(options)
    showData(newUser);

    
  });

//buscador de alumnas
  searchInput.addEventListener('input', () => {
    let search = searchInput.value;

    const options = {
      cohort : currentCohort,
      cohortData : {users, progress},
      orderBy: '',
      orderDirection: '',
      search: '',
    }

    options.search = search;
    const searching = processCohortData(options);
    responseContainerEl.innerHTML = '';
    showData(searching);
  });
//selector de ordenado ascedente y descendente
  orderSelect.addEventListener('change', () => {  
   const orderValue = orderSelect.options[orderSelect.selectedIndex].value;
    const orderArr = orderValue.split('|')
    const options = {
      cohort : currentCohort,
      cohortData : {users, progress},
      orderBy: orderArr[0],
      orderDirection: orderArr[1],
      search: '',
   }
   const newUser = processCohortData(options)
  showData(newUser);
  });
};

const handleError = () => {
  alert('hay un error')
};

//función general de llamado de data
const getData = (url, callback) => {

  let requestData = new XMLHttpRequest();
  requestData.open('GET', url);
  requestData.onload = callback;
  requestData.onerror = handleError;
  requestData.send();
};

//función que muestra los datos de stats en la tabla, se interpola cada elemento
const showData = (newUser) => {
  responseContainerEl.innerHTML = "";
  newUser.forEach((user) => {
    let totalPercent = (user.stats.percent === undefined || NaN) ?  0 : user.stats.percent;
    let exercisesPercent = isNaN(user.stats.exercises.percent) ?  0 : user.stats.exercises.percent;
    let readsPercent = isNaN(user.stats.reads.percent) ? 0 : user.stats.reads.percent;
    let quizzesPercent = isNaN(user.stats.quizzes.percent) ? 0 : user.stats.quizzes.percent;
    const row = document.createElement('tr')
    row.innerHTML = `<td>${user.name}</td><td>${totalPercent}%</td><td>${exercisesPercent}%</td><td>${readsPercent}%</td><td>${quizzesPercent}%</td><td>${user.stats.quizzes.scoreAvg}</td>`;
    responseContainerEl.appendChild(row)
  })
}

getData(usersUrl, saveUsers, 'users')
