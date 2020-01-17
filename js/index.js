var MovieList; //前250电影列表，用于制作首页
var MovieData; //单个电影数据，用于制作详情页
var classMovieList;  //通过类别筛选电影列表
var movieListId; //所有电影的id编号集合
var BASIC_URL = 'http://127.0.0.1:8888';
var apikeys= ['0df993c66c0c636e29ecbb5344252a4a','0b2bdeda43b5688921839c8ecb20399b'];
window.onload = function () {
  let movieDetail = document.getElementById("pop-movie-detail");
  let movieBar = document.getElementById("movie-bar");
  getMovieList();
   // var movieId = '1292052';
   // getMovieData(movieId);
  document.getElementById("nav-classes").addEventListener("click", function(e) {    
    if(e.target.tagName === "TD") {
      Array.from(document.getElementsByClassName("unactive")).map(e => e.className = "unactive");
      e.target.className = "unactive active";
      initialHomePageMovie(filterByClass(e.target.innerHTML))
      document.getElementById("movie-bar-label").children[0].innerHTML = e.target.innerHTML;
    }
  })
  document.getElementsByClassName("icon-search")[0].addEventListener("click", function(e) {
    initialHomePageMovie(filterByTitle(e.target.previousSibling.previousSibling.value));
    document.getElementById("movie-bar-label").children[0].innerHTML = e.target.previousSibling.previousSibling.value;
  })
  document.getElementById("movie-show").addEventListener("click", function(e) {
    console.log(e.target.getAttribute("movie-id"));
    movieDetail.style.display = "block";
    movieBar.style.display = "none";
    getMovieData(e.target.getAttribute("movie-id"));
  })
  document.getElementsByClassName("nav-logo")[0].addEventListener("click", function(e) {
    initialHomePageMovie(MovieList.subjects)
    document.getElementById("movie-bar-label").children[0].innerHTML = "经典电影";
    movieDetail.style.display = "none";
    movieBar.style.display = "block";
  })
}
//渲染详情页(获得id，发送请求，请求成功后renderDetailPageInfo(data))
function renderDetailPage() {
  var movieId = '1292052';
  getMovieData(movieId);
}

//通过类别筛选电影列表
function filterByClass(classWanted) {
  let movieListSubject = MovieList.subjects;
  movieListSubject = movieListSubject.filter(ele => ele.genres.indexOf(classWanted) > -1);
  return movieListSubject;
}

//通过名字筛选电影
function filterByTitle(titleWanted) {
  let movieListSubject = MovieList.subjects;
  movieListSubject = movieListSubject.filter(ele => ele.title.indexOf(titleWanted) > -1);
  return movieListSubject;
}

//初始化首页列表
function initialHomePageMovie(data) {
  let movieShow = document.getElementById("movie-show");
  if (data.length) {
    console.log(data.length);
    movieShow.innerHTML = Array.from(data).reduce((acc, cur) => {
      return acc += `<div class="movie-info movie-id=${cur.id}">
                      <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.images.small})"></div>
                      <div class="brief-info">
                        <p class="movie-show-title" movie-id=${cur.id}>${cur.title}</p>
                        <p class="summary">${cur.genres.join(' ')}</p>
                      </div>
                    </div> `
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
      movieListId = getMovieListId(data.subjects);
      initialHomePageMovie(data.subjects);
      console.log(data)
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
//通过豆瓣id获得相应电影详情
function getMovieData(movieId) {
  var movieId = movieId;

  options = {
    url: BASIC_URL + '/v2/movie/subject/' + movieId,
    method: "GET",
    data: {
      apikey: apikeys[0]
    },
    success: function(data) {
      console.log("get movie data success");
      MovieData = data;
      renderDetailPageInfo(data);
      console.log(data)
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}
//渲染详情页详细信息
function renderDetailPageInfo(data) {
  renderDetailPageTitle(data);
  renderDetailPageInfos(data);
  renderDetailPageReview(data);
  renderDetailPageCommits(data);
  renderDetailPageRecommand(data);
}
//渲染标题
function renderDetailPageTitle(data) {
  let title = document.getElementById("pop-movie-title");
  title.innerHTML = `
  <h2>${data.title}</h2>
  <span>${data.original_title}</span>
  `
}
//渲染电影信息
function renderDetailPageInfos(data) {
  let movieInfo = document.getElementById("movie-info");
  let movieInfoData = movieInfo.querySelectorAll("span");
  let dataArray = [data.title, data.genres,
                   data.languages, data.pubdates,
                   data.durations, data.rating.average,
                   data.directors[0].name, getCastName(data.casts)];
  for (let i = 0; i < movieInfoData.length; i++) {
    movieInfoData[i].innerHTML = dataArray[i];
  }
  renderPoster(data);
}
//渲染海报
function renderPoster(data) {
  let info = document.getElementById("pop-movie-info");
  let poster = info.querySelectorAll(".poster");
  poster[0].innerHTML = `<img src=${data.images.small} alt="poster">`;
  poster[1].innerHTML = `<img src=${data.casts[0].avatars.small} alt="poster">`;
  poster[2].innerHTML = `<img src=${data.casts[1].avatars.small} alt="poster">`;
}
//获得演员名字
function getCastName(data) {
  let casts = [];
  for (let i = 0; i < data.length; i++) {
    casts.push(data[i].name);
  }
  return casts;
}
//渲染剧情介绍
function renderDetailPageReview(data) {
  let popMovieReview = document.getElementById("pop-movie-review");
  let popMovieReviewInfo = popMovieReview.querySelector("p");
  popMovieReviewInfo.innerHTML = data.summary;
  console.log("render review success...");
}
//渲染评论
function renderDetailPageCommits(data) {
  let popMovieCommit = document.getElementById("pop-movie-commits");
  popMovieCommit.innerHTML = Array.from(data.popular_reviews).reduce((acc,cur)=> {
    return acc += `<div class="commits">
                      <strong>${cur.author.name}:</strong> <!--data.popular_reviews.author.name-->
                      <span>${cur.summary}</span>
                  </div>`
    },'')
  console.log("render commits success...");
}
//渲染相似推荐
function renderDetailPageRecommand(data) {
  let gen = data.genres[1] || data.genres[0];
  initialDetailPageMovie(filterByClass(gen));
}
//初始化详情页电影（类似首页）
function initialDetailPageMovie(data) {
  let popMovieRecommand = document.getElementById("pop-movie-recommand");
  if (data.length) {
    popMovieRecommand.innerHTML = Array.from(data).reduce((acc, cur) => {
      return acc += `<div class="movie-info movie-id=${cur.id}">
                      <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.images.small})"></div>
                      <div class="brief-info">
                        <p class="movie-show-title" movie-id=${cur.id}>${cur.title}</p>
                        <p class="summary">${cur.genres.join(' ')}</p>
                      </div>
                    </div> `
    }, "")
  } else {
    popMovieRecommand.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
  } 
}
//改变主题背景
function changeLight() {
  let container = document.querySelector("body");
  let navBar = document.getElementById("nav-bar");
  let movieBar = document.getElementById("movie-bar");
  let detailBar = document.getElementById("pop-movie-detail");
  let backColorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#f5f5f5":"#493131";
  container.style.backgroundImage = "none";
  container.style.backgroundColor = backColorNow;
  navBar.style.backgroundColor = backColorNow;
  movieBar.style.backgroundColor = backColorNow;
  detailBar.style.backgroundColor = backColorNow;
}

function chooseRandom() {
  let idLength = movieListId.length;
  let randomNum = Math.floor(Math.random() * idLength);
  let movieDetail = document.getElementById("pop-movie-detail");
  let movieBar = document.getElementById("movie-bar");
  getMovieData(movieListId[randomNum]);
  movieDetail.style.display = "block";
  movieBar.style.display = "none";
}