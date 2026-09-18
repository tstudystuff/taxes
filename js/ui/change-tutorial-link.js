export const tutorialLink = document.querySelector('#tutorialLink')
export function changeTutorialLink({e}){
    if(!e.target.dataset.timestamp) return
    const vidEL = e.target.closest('[data-video]')
    const vidBase = vidEL.dataset.video
    const ts = vidEL.dataset.timestamp

    tutorialLink.dataset.timestamp = ts || ''

    tutorialLink.href = ts ? `${vidBase}&t=${ts}s` :vidBase
    console.log(tutorialLink.href)
}