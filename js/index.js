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

//通过名字筛选电影
function filterByTitle(titleWanted) {
  let movieListSubject = MovieList;
  movieListSubject = movieListSubject.filter(
    ele => ele.name.indexOf(titleWanted) > -1 
            || makePy(ele.name).join("").indexOf(titleWanted.toUpperCase()) > -1);
  return movieListSubject;
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

