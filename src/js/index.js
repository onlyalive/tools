const arr = [
    {
        name: 'JSON工具',
        url: 'json.html',
    },
    {
        name: 'Base64解析',
        url: 'base64.html',
    },
    {
        name: '图片转Base64',
        url: 'img2base64.html'
    }
]
let navHtml = ''
arr.forEach((el, i) => {
    navHtml += `<div class="dropdown dropdown-hover">
        <a
          type="button"
          class="custom-btn"
          onclick="changeTab('${el.url}', ${i})"
        >
          ${el.name}
        </a>
      </div>`
})
document.getElementById('navs').innerHTML = navHtml
changeTab('json.html', 0)
function changeTab(url, index) {
    document.querySelectorAll('.active').forEach((el) => {
        el.classList.remove('active')
    })
    document.querySelectorAll('.dropdown')[index].classList.add('active')
    const html = `<iframe align="center" width="100%" height="100%" src="${url}"  frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>`
    document.getElementById('page').innerHTML = html
}