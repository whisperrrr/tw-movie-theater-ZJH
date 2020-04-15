let MovieList; //前250电影列表，用于制作首页
let MovieData; //单个电影数据，用于制作详情页
let CommentData; //单个电影的评论数据
let ActorData;  //单个电影的演员数据 
let classMovieList;  //通过类别筛选电影列表
let movieListId; //所有电影的id编号集合
let storage = window.localStorage;
let BASIC_URL = 'http://localhost:8080';
let apikeys= ['0df993c66c0c636e29ecbb5344252a4a','0b2bdeda43b5688921839c8ecb20399b'];

window.onload = function () {
  if(location.hash != "") {
    initialHomePageMovie(filterByClass(decodeURI(location.hash).slice(1)))
    document.getElementById("movie-bar-label").children[0].innerHTML = decodeURI(location.hash).slice(1);
    document.documentElement.scrollTop = 0;
  } else {
    getMovieList();
  }
  
  document.getElementsByClassName("icon-search")[0].addEventListener("click", searchFilterByTitle);
}

//获取排名前250的电影信息
function getMovieList() {
  options = {
    url: BASIC_URL + '/movies',
    method: "GET",
    data: {
      isAsync:true
    },
    success: function(data) {
      console.log("get movie list success");
      MovieList = data;
      storage.data = JSON.stringify(data);
      movieListId = getMovieListId(data);
      initialHomePageMovie(data);
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}

function changeLight() {
  let navBar = document.getElementById("nav-bar");
  let navSearch = document.getElementById("navsearch");
  let movieBar = document.getElementById("movie-bar");
  let logo = document.getElementsByClassName("logo-left")[0];
  let movieShow = document.getElementsByClassName("movie-show-title");
  let movieBarLable = document.getElementById("movie-bar-label");
  let movieIcon = document.getElementsByClassName("icon-dianying");
  let movieBarColor = movieBar.style.backgroundColor === "rgb(73, 49, 49)"? "transparent":"#493131";
  let backColorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#f5f5f5":"#493131";
  let colorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#000000":"#e8d195";

  navSearch.style.backgroundColor = backColorNow;
  navSearch.style.borderBottomColor = colorNow;
  navBar.style.backgroundColor = backColorNow;
  navBar.style.color = colorNow;
  movieBar.style.background = movieBarColor;
  logo.style.color = colorNow;
  movieBarLable.style.color = colorNow;
  movieIcon[0].style.color = colorNow;

  changeMovieShowColor(movieShow,colorNow);
}

function changeMovieShowColor(movieShow,colorNow) {
  for (let i = 0; i< movieShow.length; i++) {
    movieShow[i].style.color = colorNow;
  }
}