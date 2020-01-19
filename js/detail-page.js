let MovieList; //前250电影列表，用于制作首页
let MovieData; //单个电影数据，用于制作详情页
let classMovieList;  //通过类别筛选电影列表
let movieListId; //所有电影的id编号集合
let BASIC_URL = 'http://127.0.0.1:8888';
let apikeys= ['0df993c66c0c636e29ecbb5344252a4a','0b2bdeda43b5688921839c8ecb20399b'];

  let param = window.location.href.split("?")[1];
  let id = param.split("=")[1];
  getMovieData(id);
  //通过豆瓣id获得相应电影详情
function getMovieData(movieId) {
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
      console.log(data);
    },
    error: function(error) {
      console.log("error",error);
    }
  }
  ajax(options);
}

//渲染详情页详细信息
function renderDetailPageInfo(data) {
  console.log("renderDetailPageInfo")
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
  poster[1].innerHTML = `<img src=${data.casts[0].avatars.small} alt="poster" title=${data.casts[0].name}>`;
  poster[2].innerHTML = `<img src=${data.casts[1].avatars.small} alt="poster" title=${data.casts[1].name}>`;
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

// //渲染相似推荐
// function renderDetailPageRecommand(data) {
//   let gen = data.genres[1] || data.genres[0];
//   initialDetailPageMovie(filterByClass(gen));
// }

// //通过类别筛选电影列表
// function filterByClass(classWanted) {
//   let movieListSubject = MovieList.subjects;
//   movieListSubject = movieListSubject.filter(ele => ele.genres.indexOf(classWanted) > -1);
//   return movieListSubject;
// }

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