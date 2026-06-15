
function initializeReactionButtons() {
    const likeButton = document.getElementById('likeButton');
    const dislikeButton = document.getElementById('dislikeButton');
    //я долго не понимала почему у меня не работает аудио тк пыталась
    //сделать как обычно через addeventlistener в итоге поняла что слишком много одинаковых
    //const и тп и в итоге интегрировала аудио в сами функции
    const likeAudio = document.getElementById('lik');
    const dislikeAudio = document.getElementById('dis');

    function resetAllButtons() {
        //очевидно тут ресет в изначальное положение 
        //убираю css класс для того что вернуть всё в прежнее состояние
        likeButton.classList.remove('active');
        dislikeButton.classList.remove('active');
        //ресет элементов с классом text
        likeButton.querySelector('.text').textContent = 'Нравится';
        dislikeButton.querySelector('.text').textContent = 'Не нравится';
        //вобщем сё просто ресетает что мне нужно
    }

    function handleLikeClick(event) {
        //отмена стандартных действий браузера ну не прокручивает вверх и не перезагружает хотя я не уверенна сильно ли это нужно...
        event.preventDefault();

        if (likeButton.classList.contains('active')) {
            //если кнопка активна делает деактивной
            likeButton.classList.remove('active');
            likeButton.querySelector('.text').textContent = 'Нравится';
        } else {
            //ксли деактивна то делает активной
            resetAllButtons();
            likeButton.classList.add('active');
            likeButton.querySelector('.text').textContent = 'Нравится';

            if (likeAudio) {
                //теперь звук внутри
                likeAudio.play();
            }
        }
    }

    function handleDislikeClick(event) {
        event.preventDefault();
        //всё тоже самое но уже для дизлайка

        if (dislikeButton.classList.contains('active')) {
            dislikeButton.classList.remove('active');
            dislikeButton.querySelector('.text').textContent = 'Не нравится';
        } else {
            resetAllButtons();
            dislikeButton.classList.add('active');
            dislikeButton.querySelector('.text').textContent = 'Не нравится';

            if (dislikeAudio) {
                //тут так же
                dislikeAudio.play();
            }
        }
    }
    //просто указвает что делать при клике и что вызывать
    likeButton.addEventListener('click', handleLikeClick);
    dislikeButton.addEventListener('click', handleDislikeClick);
}
//вот это значит что всё сначала грузит и дом а только потом вызывать функцию кнопачек
document.addEventListener('DOMContentLoaded', initializeReactionButtons);
