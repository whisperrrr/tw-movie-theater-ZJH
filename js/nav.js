
   document.getElementById("nav-classes").addEventListener("click", clickFilterByClass);
   document.getElementById("nav-classes").addEventListener("click", changePart);

   function changePart(e) {
     location.hash = e.target.innerHTML;
   }

//随机展示电影
function chooseRandom() {
  movieListId = getMovieListId(JSON.parse(localStorage.data));
  let idLength = movieListId.length;
  let randomNum = Math.floor(Math.random() * idLength);
  window.location.href = "http://127.0.0.1:5501/client/detail-page.html?id=" + movieListId[randomNum];
}

//获取所有电影ID
function getMovieListId(data) {
  let idList = [];
  data.forEach(element => {
    idList.push(element.id);
  });
  storage.movieId = idList;
  return idList;
}

//通过名字筛选电影
function filterByTitle(titleWanted) {
  let movieListSubject = JSON.parse(localStorage.data);
  movieListSubject = movieListSubject.filter(ele => ele.name.indexOf(titleWanted) > -1);
  return movieListSubject;
}

//点击搜索筛选电影
function searchFilterByTitle(e) {
  initialHomePageMovie(filterByTitle(e.target.previousSibling.previousSibling.value));
  document.getElementById("movie-bar-label").children[0].innerHTML = e.target.previousSibling.previousSibling.value;
}

//通过类别筛选电影列表
function filterByClass(classWanted) {
  movieListSubject = JSON.parse(window.localStorage.data).filter(ele => ele.type.indexOf(classWanted) > -1);
  return movieListSubject;
}

//点击类别筛选电影
function clickFilterByClass(e) {    
  if(e.target.tagName === "TD") {
    var target = e.target.innerHTML;
    window.location.href = "http://127.0.0.1:5501/client/index.html#" + target;
    Array.from(document.getElementsByClassName("unactive")).map(e => e.className = "unactive");
    e.target.className = "unactive active";
    initialHomePageMovie(filterByClass(target))
    document.getElementById("movie-bar-label").children[0].innerHTML = target;
    document.documentElement.scrollTop = 0;
  }
}

//初始化详情页电影（类似首页）
function initialDetailPageMovie(data) {
  let popMovieRecommand = document.getElementById("pop-movie-recommand");
  if (data.length) {
    popMovieRecommand.innerHTML = Array.from(data).reduce((acc, cur) => {
        return acc += `<a target="_blank" href="./detail-page.html?id=${cur.id}">
        <div class="movie-info movie-id=${cur.id}">
          <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.smallImg})"></div>
          <div class="brief-info">
            <p class="movie-show-title" movie-id=${cur.id}>${cur.name}</p>
            <p class="summary">${cur.type}</p>
          </div>
        </div>
      </a> `
    }, "")
  } else {
    popMovieRecommand.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
  } 
}

//初始化首页列表
function initialHomePageMovie(data) {
  let movieShow = document.getElementById("movie-show");
  if (data.length) {
      movieShow.innerHTML = Array.from(data).reduce((acc, cur) => {
        return acc += `<a target="_blank" href="./detail-page.html?id=${cur.id}">
                    <div class="movie-info movie-id=${cur.id}">
                      <div class="poster"  movie-id=${cur.id} style="background-image:url(${cur.smallImg})"></div>
                      <div class="brief-info">
                        <p class="movie-show-title" movie-id=${cur.id}>${cur.name}</p>
                        <p class="summary">${cur.type}</p>
                      </div>
                    </div>
                  </a> `
    }, "")
  } else {
    movieShow.innerHTML = `<strong class="no-result">没有搜索到结果</strong>`
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