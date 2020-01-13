var MovieList; //前250电影列表，用于制作首页
var MovieData; //单个电影数据，用于制作详情页
var BASIC_URL = 'http://127.0.0.1:8888';
window.onload = function () {
  getMovieList();
  
  var movieId = '26942674';
  getMovieData(movieId);
}
function getMovieList() {
  options = {
    url: BASIC_URL + '/v2/movie/top250',
    method: "GET",
    data: {
      apikey: '0df993c66c0c636e29ecbb5344252a4a'
    },
    success: function(data) {
      console.log("get movie list success");
      MovieList = data;
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}
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
