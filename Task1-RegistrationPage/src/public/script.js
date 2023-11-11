const lock = document.getElementById('lock')
const password = document.getElementById('password')
const ConfirmPassword = document.getElementById('ConfirmPassword')
const check = document.getElementById('check')


lock.onclick =  () => {
    if(lock.classList.contains('fa-lock')){
        lock.classList.add('fa-unlock')
        lock.classList.remove('fa-lock')
        password.type = "text"
    }
    else{
        lock.classList.add('fa-lock')
        lock.classList.remove('fa-unlock')
        password.type = "password"
    }
    // alert('clicked')
}

// const confirm = ConfirmPassword.innerHTML

ConfirmPassword.onchange = () => {
    (password.value === ConfirmPassword.value)?check.style.color = "green":check.style.color = "red"
}




