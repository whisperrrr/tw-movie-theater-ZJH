var MovieList; //前250电影列表，用于制作首页
var MovieData; //单个电影数据，用于制作详情页
var classMovieList;  //通过类别筛选电影列表
var BASIC_URL = 'http://127.0.0.1:8888';
window.onload = function () {
  // getMovieList();
}
//渲染详情页
function renderDetailPage() {
  var movieId = '1292052';
  getMovieData(movieId);
}
//通过类别筛选电影列表
// var classWanted = "动作";
// classMovieList = filterByClass(classWanted);
function filterByClass(classWanted) {
  var movieListSubject = MovieList.subjects;
  movieListSubject = movieListSubject.filter(ele => ele.genres.indexOf(classWanted) > -1);
  return movieListSubject;
}

//初始化首页列表
function initialHomePageMovie(data) {
  let movieShow = document.getElementById("movie-show");
  movieShow.innerHTML = Array.from(data.subjects).reduce((acc, cur) => {
    return acc += `<div class="movie-info">
                     <div class="poster" style="background-image:url(${cur.images.small})"></div>
                     <div class="brief-info">
                       <p class="movie-show-title">${cur.title}</p>
                       <p class="summary">${cur.genres.join(' ')}</p>
                     </div>
                   </div> `
  }, "")
}

//获取排名前250的电影信息
function getMovieList() {
  options = {
    url: BASIC_URL + '/v2/movie/top250',
    method: "GET",
    data: {
      apikey: '0df993c66c0c636e29ecbb5344252a4a&start=0&count=100'
    },
    success: function(data) {
      console.log("get movie list success");
      MovieList = data;
      initialHomePageMovie(data);
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}
//通过豆瓣id获得相应电影详情
function getMovieData(movieId) {
  var movieId = movieId;

  options = {
    url: BASIC_URL + '/v2/movie/subject/' + movieId,
    method: "GET",
    data: {
      apikey: '0df993c66c0c636e29ecbb5344252a4a'
    },
    success: function(data) {
      console.log("get movie data success");
      MovieData = data;
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}
