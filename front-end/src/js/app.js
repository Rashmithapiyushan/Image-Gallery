const overlay=$("#overlay");
const btnUpload=$("#btn-upload");
const dropZone=$("#drop-zone");
const mainElm=$("main");
const REST_API_URL=`http://localhost:8080/gallery`
const cssLoaderHtml=`<div class="lds-facebook"><div></div><div></div><div></div></div>`
loadAllImages();

btnUpload.on("click",()=>overlay.removeClass("d-none"));
overlay.on("click",(evt)=>{
    if(evt.target===overlay[0]) overlay.addClass('d-none');
});
$(document).on("keydown",(evt)=>{
    if(evt.key==='Escape' && !overlay.hasClass('d-none')){
        overlay.addClass('d-none');
    }
});
overlay.on("dragover",(evt)=>{
    evt.preventDefault();
});
overlay.on("drop",(evt)=>{
    evt.preventDefault();
});
dropZone.on("dragover",(evt)=>{
    evt.preventDefault();
});

dropZone.on("drop",(evt)=>{
    evt.preventDefault();
    const dropFiles=evt.originalEvent.dataTransfer.files;
    const imageFiles=Array.from(dropFiles).filter(file=>file.type.startsWith("image/"))
    if(!imageFiles.length)return;
    overlay.addClass("d-none");
    uploadImages(imageFiles);
});

mainElm.on("click",'.image:not(.loader)',(evt)=>{
    evt.target.requestFullscreen();
});
mainElm.on("click",".image .download a svg",(evt)=>{
    const url=($(evt.target).parents(".image").css("background-image").slice(5,-2));
    $(evt.target).parent().attr('href',`${url}`).attr("download");
})

function uploadImages(imageFiles){
    const formData=new FormData();
    imageFiles.forEach(imageFile=>{
        const divElm=$(`<div class='image loader'></div>`);
        divElm.append(cssLoaderHtml);
        mainElm.append(divElm);

        formData.append("images",imageFile);
    });

    const jqxhr=$.ajax(`${REST_API_URL}/images`,{
        method:'POST',
        data:formData,
        contentType:false,//by default jquery uses application/x-www-form-urlencoded.
        processData:false //by default jquery tries to convert the data into string.

    });
    jqxhr.done((imageUrlList)=>{
        imageUrlList.forEach(url=>{
           const divElm=$(".image.loader").first();
           divElm.css("background-image",`url('${url}')`);
           divElm.empty();
           divElm.removeClass('loader');
        });
    });
    jqxhr.always(()=>{
        $(".image.loader").remove();
    })
}



function loadAllImages(){
    const jqxhr=$.ajax(`${REST_API_URL}/images`);
    jqxhr.done((imageUrlList)=>{
        imageUrlList.forEach(imageUrl=>{
           const divElm=$(`<div class="image"><div class="download">
                                <a>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                                    </svg>
                                </a>
                            </div></div>`);
           divElm.css("background-image",`url(${imageUrl})`);
           $("main").append(divElm);
        });
    });
    jqxhr.fail(()=>{

    });



}

