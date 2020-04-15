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
  
  // document.getElementById("nav-classes").addEventListener("click", clickFilterByClass);
  // document.getElementById("nav-classes").addEventListener("click", changePart);
  document.getElementsByClassName("icon-search")[0].addEventListener("click", searchFilterByTitle);
}


//通过名字筛选电影
function filterByTitle(titleWanted) {
  let movieListSubject = MovieList;
  movieListSubject = movieListSubject.filter(ele => ele.name.indexOf(titleWanted) > -1);
  return movieListSubject;
}

//点击搜索筛选电影
function searchFilterByTitle(e) {
  initialHomePageMovie(filterByTitle(e.target.previousSibling.previousSibling.value));
  document.getElementById("movie-bar-label").children[0].innerHTML = e.target.previousSibling.previousSibling.value;
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

// //初始化详情页电影（类似首页）
// function initialDetailPageMovie(data) {
//   let popMovieRecommand = document.getElementById("pop-movie-recommand");
//   if (data.length) {
//     popMovieRecommand.innerHTML = Array.from(data).reduce((acc, cur) => {
//       return acc += `<a target="_blank" href="./detail-page.html?id=${cur.id}>
//                       <div class="movie-info movie-id=${cur.id}">
//                         <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.images.small})"></div>
//                         <div class="brief-info">
//                           <p class="movie-show-title" movie-id=${cur.id}>${cur.title}</p>
//                           <p class="summary">${cur.genres.join(' ')}</p>
//                         </div>
//                       </div>
//                      </a> `
//     }, "")
//   } else {
//     popMovieRecommand.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
//   } 
// }

//改变主题背景
// function changeLight() {
//   let navBar = document.getElementById("nav-bar");
//   let navSearch = document.getElementById("navsearch");
//   let backColorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#f5f5f5":"#493131";
//   let colorNow = navBar.style.backgroundColor === "rgb(73, 49, 49)"? "#000000":"#e8d195";
//   navSearch.style.backgroundColor = backColorNow;
//   navSearch.style.borderBottomColor = colorNow;
//   navBar.style.backgroundColor = backColorNow;
//   navBar.style.color = colorNow;
// }

// //随机展示电影
// function chooseRandom() {
//   movieListId = getMovieListId(JSON.parse(localStorage.data));
//   let idLength = movieListId.length;
//   let randomNum = Math.floor(Math.random() * idLength);
//   window.location.href = "http://127.0.0.1:5501/client/detail-page.html?id=" + movieListId[randomNum];
// }


//初始化首页列表
// function initialHomePageMovie(data) {
//   let movieShow = document.getElementById("movie-show");
//   if (data.length) {
//       movieShow.innerHTML = Array.from(data).reduce((acc, cur) => {
//         return acc += `<a target="_blank" href="./detail-page.html?id=${cur.id}">
//                     <div class="movie-info movie-id=${cur.id}">
//                       <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.smallImg})"></div>
//                       <div class="brief-info">
//                         <p class="movie-show-title" movie-id=${cur.id}>${cur.name}</p>
//                         <p class="summary">${cur.type}</p>
//                       </div>
//                     </div>
//                   </a> `
//     }, "")
//   } else {
//     movieShow.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
//   } 
// }

//获取所有电影ID
// function getMovieListId(data) {
//   let idList = [];
//   data.forEach(element => {
//     idList.push(element.id);
//   });
//   storage.movieId = idList;
//   return idList;
// }

//通过类别筛选电影列表
// function filterByClass(classWanted) {
//   movieListSubject = JSON.parse(localStorage.data).filter(ele => ele.type.indexOf(classWanted) > -1);
//   return movieListSubject;
// }

//点击类别筛选电影
// function clickFilterByClass(e) {    
//   if(e.target.tagName === "TD") {
//     Array.from(document.getElementsByClassName("unactive")).map(e => e.className = "unactive");
//     e.target.className = "unactive active";
//     initialHomePageMovie(filterByClass(e.target.innerHTML))
//     document.getElementById("movie-bar-label").children[0].innerHTML = e.target.innerHTML;
//     document.documentElement.scrollTop = 0;
//   }
// }