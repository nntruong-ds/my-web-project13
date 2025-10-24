document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const nextList = this.parentElement.querySelector('ul');
        if (nextList) {
            nextList.classList.toggle('hidden');
            this.textContent = nextList.classList.contains('hidden') ? '▶' : '▼';
        }
    });
});
document.getElementById('capnhat').addEventListener('click', function() {
    window.location.href = "capnhat.html";
});