let MovieList; //前250电影列表，用于制作首页
let MovieData; //单个电影数据，用于制作详情页
let CommentData; //单个电影的评论数据
let ActorData;  //单个电影的演员数据 
let classMovieList;  //通过类别筛选电影列表
let movieListId; //所有电影的id编号集合
let storage = window.localStorage;
//let BASIC_URL = 'http://127.0.0.1:8888';
let BASIC_URL = 'http://localhost:8080';
let apikeys= ['0df993c66c0c636e29ecbb5344252a4a','0b2bdeda43b5688921839c8ecb20399b'];
let param = window.location.href.split("?")[1];
let id = param.split("=")[1];

window.onload = function() {
  getActorData(id,false);
  getCommentData(id,false);
  getMovieData(id,true);
  document.getElementById("nav-classes").addEventListener("click", clickFilterByClass);
}

  //通过豆瓣id获得相应电影详情
function getMovieData(movieId,async) {
  options = {
    url: BASIC_URL + '/movie/' + movieId,
    method: "GET",
    data: {
      isAsync:async  
    },
    success: function(data) {
      console.log("get movie data success");
      MovieData = data;
      renderDetailPageInfo();
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}

function getActorData(movieId,async) {
  options = {
    url: BASIC_URL + '/movie/actor/' + movieId,
    method: "GET",
    data: {
      isAsync:async
    },
    success: function(data) {
      console.log("get actor data success");
      ActorData = data;
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}

function getCommentData(movieId,async) {
  options = {
    url: BASIC_URL + '/movie/comment/' + movieId,
    method: "GET",
    data: {
      isAsync:async
    },
    success: function(data) {
      console.log("get comment data success");
      CommentData = data;
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}

//渲染详情页详细信息
function renderDetailPageInfo() {
  console.log("renderDetailPageInfo")
  renderDetailPageTitle();
  renderDetailPageInfos();
  renderDetailPageReview();
  renderDetailPageCommits();
  renderDetailPageRecommand();
}

//渲染标题
function renderDetailPageTitle() {
  let title = document.getElementById("pop-movie-title");
    title.innerHTML = `
  <h2>${MovieData.name}</h2>
  <span>${MovieData.originTitle}</span>
  `
}

//渲染电影信息
function renderDetailPageInfos(data) {
  let movieInfo = document.getElementById("movie-info");
  let movieInfoData = movieInfo.querySelectorAll("span");
    let dataArray = [MovieData.name, MovieData.type,
                   MovieData.language, MovieData.year,
                   MovieData.durations, MovieData.rating,
                   MovieData.director, getCastName(ActorData)];
  for (let i = 0; i < movieInfoData.length; i++) {
    movieInfoData[i].innerHTML = dataArray[i];
  }
  renderPoster(data);
}

//渲染海报
function renderPoster(data) {
  let info = document.getElementById("pop-movie-info");
  let poster = info.querySelectorAll(".poster");
  poster[0].innerHTML = `<img src=${MovieData.smallImg} alt="poster">`;
  poster[1].innerHTML = `<img src=${ActorData[0].smallImg} alt="poster" title=${ActorData[0].name}>`;
  poster[2].innerHTML = `<img src=${ActorData[1].smallImg} alt="poster" title=${ActorData[1].name}>`;
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
  popMovieReviewInfo.innerHTML = MovieData.summary;
  console.log("render review success...");
}

//渲染评论
function renderDetailPageCommits(data) {
  let popMovieCommit = document.getElementById("pop-movie-commits");
  popMovieCommit.innerHTML = Array.from(CommentData).reduce((acc,cur)=> {
  return acc += `<div class="commits">
                    <strong>${cur.name}:</strong> <!--data.popular_reviews.author.name-->
                    <span>${cur.commitInfo}</span>
                </div>`
  },'')
  console.log("render commits success...");
}

//渲染相似推荐
function renderDetailPageRecommand(data) {
  let movieTypeList = MovieData.type.split(",");
  let gen = movieTypeList[1] || movieTypeList[0];
  initialDetailPageMovie(filterByClass(gen));
}

