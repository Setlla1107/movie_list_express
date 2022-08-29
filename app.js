// 用require載入express
const express = require('express')
const app = express()
const port = 3000

// 將JSON檔載入express中
const movieList = require('./movies.json').results

// 用require載入express-handlebars，定義樣板引擎
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定express靜態檔案路由
app.use(express.static('public'))

// 將資料帶入index列表樣板
app.get('/', (req, res) => {
  // 將movieList 放入 'index' 樣板引擎裡
  res.render('index', { movies: movieList });
})

// 將資料帶入show個別樣板
app.get('/movies/:movie_id', (req, res) => {
  // console.log('req.params.movie_id', req.params.movie_id)
  const movie = movieList.find(
    movie => movie.id.toString() === req.params.movie_id
    )  
    res.render('show', { movie })
//{ 物件屬性名稱，會被show文件使用: 值是自建的const常數 }
// 如此，就可以把 movie 的資料送到 show.handlebars 中使用
}) 

// 設定搜尋路由
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  // 使用者輸入的內容，form表單裡的名稱input欄位裡的name叫keyword
  const keywords = req.query.keyword.trim().toLowerCase()
  const movies = movieList.filter(movie => {
    return movie.title.toLowerCase().includes(keywords)
    
  })
  if (movies.length === 0 && keyword.length !== 0) {
    res.render('error', { keyword })
    return
  } else {
      //movieList裡的名稱也都改小寫，有包含使用者輸入的內容keyword時就回傳該電影
  // console.log('req.query', req.query)
  res.render('index', { movies, keyword })
                            // 保留使用者搜尋字串
  }                                    
})

// 啟動伺服器去監聽
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})