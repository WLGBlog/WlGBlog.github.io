let category = $('#category');
if(localStorage.getItem("cat")) {
    category.val(localStorage.getItem("cat"));
}


updateNews(category.val());

function updateNews(cat) {
    fetch('https://newsapi.org/v2/top-headlines?country=us&category='+cat+'&apiKey=d6bcee3257294b33a78a2bf409d05c4c')
    .then(function(response) {
        return response.json();
    }).then((data)=>{
        let html = "";
        data.articles.forEach((info)=>{
            html+=`
            <div class="card bg-light mb-2">
                <img class="card-img-top" src="${info.urlToImage}">
                <div class="card-body">
                  <h5 class="card-title">${info.title}</h5>
                  <p class="card-text">${(info.description?info.description:"")}</p>
                  <a href="${info.url}" target="_blank" class="btn btn-primary">Read More</a>
                </div>
          </div>`;
        });
        $('#articles').html(html);
        $(document).ready(function(){
         $("img").bind("error",function(){
          $(this).attr("src","https://s18.postimg.cc/ktjga2muh/blank.jpg");
         });
        });
    });
}

category.change(()=>{
    localStorage.setItem("cat", category.val());
    updateNews(category.val())
});
