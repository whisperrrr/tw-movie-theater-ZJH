let MovieList; //前250电影列表，用于制作首页
let MovieData; //单个电影数据，用于制作详情页
let classMovieList;  //通过类别筛选电影列表
let movieListId; //所有电影的id编号集合
let storage = window.localStorage;
let BASIC_URL = 'http://127.0.0.1:8888';
let apikeys= ['0df993c66c0c636e29ecbb5344252a4a','0b2bdeda43b5688921839c8ecb20399b'];

window.onload = function () {
  getMovieList();
  document.getElementById("nav-classes").addEventListener("click", clickFilterByClass);
  document.getElementsByClassName("icon-search")[0].addEventListener("click", searchFilterByTitle);
}

//显示首页or详情页
function displayWindow(win) {
  let movieDetail = document.getElementById("pop-movie-detail");
  let movieBar = document.getElementById("movie-bar");
  switch(win) {
    case 'home': 
      movieDetail.style.display = "none";
      movieBar.style.display = "block";
      break;
    case 'detail':
      movieDetail.style.display = "block";
      movieBar.style.display = "none";
  }
}

//通过类别筛选电影列表
function filterByClass(classWanted) {
  let movieListSubject = MovieList.subjects;
  movieListSubject = movieListSubject.filter(ele => ele.genres.indexOf(classWanted) > -1);
  return movieListSubject;
}

//点击类别筛选电影
function clickFilterByClass(e) {    
  if(e.target.tagName === "TD") {
    Array.from(document.getElementsByClassName("unactive")).map(e => e.className = "unactive");
    e.target.className = "unactive active";
    initialHomePageMovie(filterByClass(e.target.innerHTML))
    document.getElementById("movie-bar-label").children[0].innerHTML = e.target.innerHTML;
    displayWindow("home");
    document.documentElement.scrollTop = 0;
  }
}

//通过名字筛选电影
function filterByTitle(titleWanted) {
  let movieListSubject = MovieList.subjects;
  movieListSubject = movieListSubject.filter(ele => ele.title.indexOf(titleWanted) > -1);
  return movieListSubject;
}

//点击搜索筛选电影
function searchFilterByTitle(e) {
  initialHomePageMovie(filterByTitle(e.target.previousSibling.previousSibling.value));
  document.getElementById("movie-bar-label").children[0].innerHTML = e.target.previousSibling.previousSibling.value;
  displayWindow("home");
}

//点击首页电影跳转到详情页
function movieToDetail(e) {
  let id = e.target.getAttribute("movie-id")
  if (id) {
    getMovieData(id);
    displayWindow("detail");
    document.documentElement.scrollTop = 0;
  }
}

//初始化首页列表
function initialHomePageMovie(data) {
  let movieShow = document.getElementById("movie-show");
  if (data.length) {
      movieShow.innerHTML = Array.from(data).reduce((acc, cur) => {
      return acc += `<a target="_blank" href="./detail-page.html?id=${cur.id}">
                        <div class="movie-info movie-id=${cur.id}">
                          <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.images.small})"></div>
                          <div class="brief-info">
                            <p class="movie-show-title" movie-id=${cur.id}>${cur.title}</p>
                            <p class="summary">${cur.genres.join(' ')}</p>
                          </div>
                        </div>
                      </a> `
    }, "")
  } else {
    movieShow.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
  } 
}

//获取排名前250的电影信息
function getMovieList() {
  options = {
    url: BASIC_URL + '/v2/movie/top250',
    method: "GET",
    data: {
      apikey: apikeys[0] + '&start=0&count=100'
    },
    success: function(data) {
      console.log("get movie list success");
      MovieList = data;
      storage.data = JSON.stringify(data);
      movieListId = getMovieListId(MovieList.subjects);
      initialHomePageMovie(MovieList.subjects);
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}

//获取所有电影ID
function getMovieListId(data) {
  let idList = [];
  data.forEach(element => {
    idList.push(element.id);
  });
  return idList;
}

//初始化详情页电影（类似首页）
function initialDetailPageMovie(data) {
  let popMovieRecommand = document.getElementById("pop-movie-recommand");
  if (data.length) {
    popMovieRecommand.innerHTML = Array.from(data).reduce((acc, cur) => {
      return acc += `<a target="_blank" href="./detail-page.html?id=${cur.id}>
                      <div class="movie-info movie-id=${cur.id}">
                        <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.images.small})"></div>
                        <div class="brief-info">
                          <p class="movie-show-title" movie-id=${cur.id}>${cur.title}</p>
                          <p class="summary">${cur.genres.join(' ')}</p>
                        </div>
                      </div>
                     </a> `
    }, "")
  } else {
    popMovieRecommand.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
  } 
}

//改变主题背景
function changeLight() {
  let navBar = document.getElementById("nav-bar");
  let navSearch = document.getElementById("navsearch");
  let backColorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#f5f5f5":"#493131";
  let colorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#000000":"#e8d195";
  navSearch.style.backgroundColor = backColorNow;
  navSearch.style.borderBottomColor = colorNow;
  navBar.style.backgroundColor = backColorNow;
  navBar.style.color = colorNow;
}

//随机展示电影
function chooseRandom() {
  let idLength = movieListId.length;
  let randomNum = Math.floor(Math.random() * idLength);
  let movieDetail = document.getElementById("pop-movie-detail");
  let movieBar = document.getElementById("movie-bar");
  getMovieData(movieListId[randomNum]);
  movieDetail.style.display = "block";
  movieBar.style.display = "none";
}