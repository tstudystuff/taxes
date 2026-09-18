export function handleImgSizes({e}){
    const step = e.target.closest('.step')
    if(!step) return
    console.log(step.querySelector('video'))
    const media = step.querySelector('img') ? step.querySelector('img') : step.querySelector('video')
    if(media.length > 1){
        alert('not yet')
    } else {
        toggleImgSize(media)

    }
}

function toggleImgSize(media){
    
    media.classList.toggle('enlarge')

}
