let trash = {};
let i = 1;

function test(id) {
    document.querySelector('.trash').firstChild.textContent = 'Корзина ' + i++ + ' шт.';
    if (trash[id]) { trash[id]++; } else { trash[id] = 1; }
    POSTT(id);
}

function POSTT(id) {
    fetch("/", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: Object.keys(trash), value: trash, id: id })
        }).then(res => res.json())
        .then(json => console.log(json));
}

function Delete(id) {
    fetch("/trash", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: id })
        }).then(res => res.json())
        .then(json => console.log(json));
    window.location.href = "/trash";
}

function Add(id) {
    fetch("/trash", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key1: id })
        }).then(res => res.json())
        .then(json => console.log(json));
    window.location.href = "/trash";
}

function GETT() {
    window.location.href = "/trash";
}

function Zakaz() {
    window.location.href = "/zakaz";
}

function print() {
    window.print();
}